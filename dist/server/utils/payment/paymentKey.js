"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const CryptoJS = __importStar(require("crypto-js"));
const generateInitializationVector = () => {
    // Generate a random IV
    const randomIv = CryptoJS.lib.WordArray.random(16); // 16 bytes for AES-128, adjust based on your encryption algorithm
    // Convert IV to a hexadecimal string
    return randomIv.toString(CryptoJS.enc.Hex);
};
const generateEncryptionKeyIfNeeded = (envFilePath) => {
    try {
        // Read the content of the .env file
        const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
        // Check if STRAPI_ADMIN_ENCRYPTION_KEY exists in the .env file
        if (envFileContent.includes('STRAPI_ADMIN_ENCRYPTION_KEY=')) {
            console.log(envFileContent.includes('STRAPI_ADMIN_ENCRYPTION_KEY='));
            return { success: false, message: 'STRAPI_ADMIN_ENCRYPTION_KEY already exists. No need to generate a new one.' };
        }
        else {
            // Generate a new key using CryptoJS
            const newEncryptionKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
            // Generate a new IV using CryptoJS
            const newIv = generateInitializationVector();
            // Append the new ENCRYPTION_KEY and IV to the .env file
            const updatedEnvFileContent = `${envFileContent}\nSTRAPI_ADMIN_ENCRYPTION_KEY=${newEncryptionKey}\nSTRAPI_ADMIN_IV=${newIv}`;
            // Write the updated content back to the .env file
            fs.writeFileSync(envFilePath, updatedEnvFileContent, 'utf-8');
            return { success: true, message: 'Encryption key and IV have been successfully generated and added to the .env file.' };
        }
    }
    catch (error) {
        return { success: false, message: `Error: ${error.message}` };
    }
};
exports.default = generateEncryptionKeyIfNeeded;
