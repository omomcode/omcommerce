"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
// @ts-ignore
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 * Encrypts the given data using AES-256-CBC encryption.
 * @param dataToEncrypt The data to be encrypted.
 * @returns The encrypted data in hexadecimal format.
 */
function encryptData(dataToEncrypt) {
    // @ts-ignore
    const key = crypto_js_1.default.enc.Hex.parse(process.env.STRAPI_ADMIN_ENCRYPTION_KEY);
    // @ts-ignore
    const iv = crypto_js_1.default.enc.Hex.parse(process.env.STRAPI_ADMIN_IV);
    const encrypted = crypto_js_1.default.AES.encrypt(dataToEncrypt, key, {
        iv: iv,
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return encrypted.toString();
}
exports.encryptData = encryptData;
/**
 * Decrypts the given encrypted data using AES-256-CBC decryption.
 * @param encryptedData The encrypted data in hexadecimal format.
 * @returns The decrypted original data.
 */
function decryptData(encryptedData) {
    // @ts-ignore
    const key = crypto_js_1.default.enc.Hex.parse(process.env.STRAPI_ADMIN_ENCRYPTION_KEY);
    // @ts-ignore
    const iv = crypto_js_1.default.enc.Hex.parse(process.env.STRAPI_ADMIN_IV);
    const decrypted = crypto_js_1.default.AES.decrypt(encryptedData, key, {
        iv: iv,
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return decrypted.toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptData = decryptData;
