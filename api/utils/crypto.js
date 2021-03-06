/* eslint-disable no-extend-native */
import sha256 from 'sha256';
import crypto from 'crypto';
import config from 'config';

/**
 * Generate a random string of the given length
 * @param {number} length The length of the string.
 */
export function generateRandomString(length) {
  return crypto.randomBytes(Math.floor(length / 2)).toString('hex');
}

/**
 * Encrypt the given text using `aes-256-ctr` and get the hex output.
 * @param {string} text The text to encrypt
 * @param {string} password The encryption password.
 * @returns The encrypted string as hex.
 */
export function hexEncrypt(text, password) {
  const cipher = crypto.createCipher('aes-256-ctr', password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypty the given hex string using `aes-256-ctr` and get the original string output.
 * @param {string} encryptedText The encrypted hex string.
 * @param {string} password The decryption password.
 * @returns The decrypted string.
 */
export function hexDecrypt(encryptedText, password) {
  const decipher = crypto.createDecipher('aes-256-ctr', password);
  let dec = decipher.update(encryptedText, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/* Decrypt base64 string using aes-256-cbc */
function decrypt(encryptedText, seed) {
  const decipher = crypto.createDecipher('aes-256-cbc', seed);
  let dec = decipher.update(encryptedText, 'base64', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * Decrypt the API payload.
 * @param {function} callback The callback which returns the decrypted payload
 */
export function decryptAPIPayload(req, res, next, callback) {
  // Only decrypt if we use encryption
  if (!config.get('useAPIEncryption')) {
    callback(req.body);
    return null;
  }

  const { m, e, t, s, u, p } = req.body;

  if (!m || !e || !t || !s || !u || !p) {
    res.status(501);
    res.body = { status: 501, success: false, result: 'Invalid payload' };
    return next(null, req, res, next);
  }

  const mnemonic = hexDecode(m);
  const encrypted = hexDecode(e);
  const signature = s;

  const sig = { e, m, u, p, t };
  const seed = JSON.stringify(sig);
  const hashedSignature = sha256(seed);

  if (hashedSignature !== signature) {
    res.status(501);
    res.body = { status: 501, success: false, result: 'Signature mismatch' };
    return next(null, req, res, next);
  }

  const payload = decrypt(encrypted, mnemonic);

  try {
    const data = JSON.parse(payload);
    callback(data);
  } catch (error) {
    res.status(501);
    res.body = { status: 501, success: false, result: error };
    return next(null, req, res, next);
  }

  return null;
}

function hexDecode(hex) {
  let str = '';
  for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}
