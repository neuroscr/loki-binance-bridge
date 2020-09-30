import axios from 'axios';
import { EventEmitter } from 'events';
import { encrypt } from 'utils/crypto';
import { Warning } from 'utils/error';
import config from 'config';
import * as Actions from './actions';
import * as Events from './events';
import dispatcher from './dispatcher';

const { apiUrl, useAPIEncryption } = config;

const httpClient = axios.create({ baseURL: apiUrl });
const endpoints = {
  getInfo: '/api/v1/getInfo',
  getUnconfirmedTransactions: '/api/v1/getUnconfirmedTransactions',
  getSwaps: '/api/v1/getSwaps',
  swap: '/api/v1/swap',
  finalizeSwap: '/api/v1/refresh',
  createBNBAccount: '/api/v1/createBNBAccount',
  downloadBNBKeystore: '/api/v1/downloadBNBKeystore',
};

class Store extends EventEmitter {
  constructor() {
    super();
    this.store = {};

    dispatcher.register(async payload => {
      switch(payload.type) {
        case Actions.GET_INFO:
          this.getInfo();
          break;
        case Actions.GET_UNCONFIRMED_TXS:
          this.getUnconfirmedTransactions(payload);
          break;
        case Actions.GET_SWAPS:
          this.getSwaps(payload);
          break;
        case Actions.SWAP_TOKEN:
          this.swapToken(payload);
          break;
        case Actions.FINALIZE_SWAP_TOKEN:
          this.finalizeSwap(payload);
          break;
        default: break;
      }
    });
  }

  getStore(key) {
    return this.store[key];
  };

  async getInfo() {
    try {
      const data = await this.fetch(endpoints.getInfo, 'GET');
      this.store.info = data.result;
      this.emit(Events.FETCHED_INFO, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async getUnconfirmedTransactions(payload) {
    try {
      const data = await this.fetch(endpoints.getUnconfirmedTransactions, 'GET', payload.content);
      this.emit(Events.FETCHED_UNCONFIRMED_TXS, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async getSwaps(payload) {
    try {
      const data = await this.fetch(endpoints.getSwaps, 'GET', payload.content);
      this.emit(Events.FETCHED_SWAPS, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async swapToken(payload) {
    try {
      const data = await this.fetch(endpoints.swap, 'POST', payload.content);
      this.emit(Events.TOKEN_SWAPPED, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async finalizeSwap(payload) {
    try {
      const data = await this.fetch(endpoints.finalizeSwap, 'POST', payload.content);
      this.emit(Events.TOKEN_SWAP_FINALIZED, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async fetch(url, method, params = null) {
    const field = method.toLowerCase() === 'post' ? 'data' : 'params';
    try {
      const { data } = await httpClient({
        method,
        url,
        [field]: params
      });

      if (data.status === 200 && !data.success) {
        throw new Warning(data.result);
      }

      return data;
    } catch (e) {
      console.log(`Failed fetch ${url}: `, e);

      // If we got an error from the api then throw it
      if (e.response && e.response.data) {
        throw new Error(e.response.data.result);
      }

      // Some other error occurred
      throw e;
    }
  }
}

export default new Store();
