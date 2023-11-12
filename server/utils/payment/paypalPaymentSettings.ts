// @ts-ignore
import CryptoJS  from 'crypto-js';

/**
 * Encrypts the given data using AES-256-CBC encryption.
 * @param dataToEncrypt The data to be encrypted.
 * @returns The encrypted data in hexadecimal format.
 */
export function encryptData(dataToEncrypt: string): string {

  // @ts-ignore
  const key = CryptoJS.enc.Hex.parse(process.env.STRAPI_ADMIN_ENCRYPTION_KEY);
  // @ts-ignore
  const iv = CryptoJS.enc.Hex.parse(process.env.STRAPI_ADMIN_IV);

  const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

/**
 * Decrypts the given encrypted data using AES-256-CBC decryption.
 * @param encryptedData The encrypted data in hexadecimal format.
 * @returns The decrypted original data.
 */
export function decryptData(encryptedData: string): string {
  // @ts-ignore
  const key = CryptoJS.enc.Hex.parse(process.env.STRAPI_ADMIN_ENCRYPTION_KEY);
  // @ts-ignore
  const iv = CryptoJS.enc.Hex.parse(process.env.STRAPI_ADMIN_IV);

  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
