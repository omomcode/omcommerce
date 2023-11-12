import * as fs from 'fs';
import * as CryptoJS from 'crypto-js';

interface KeyGenerationResult {
  success: boolean;
  message: string;
}

const generateInitializationVector = (): string => {
  // Generate a random IV
  const randomIv = CryptoJS.lib.WordArray.random(16); // 16 bytes for AES-128, adjust based on your encryption algorithm

  // Convert IV to a hexadecimal string
  return randomIv.toString(CryptoJS.enc.Hex);
};

const generateEncryptionKeyIfNeeded = (envFilePath: string): KeyGenerationResult => {
  try {
    // Read the content of the .env file
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8');

    // Check if STRAPI_ADMIN_ENCRYPTION_KEY exists in the .env file
    if (envFileContent.includes('STRAPI_ADMIN_ENCRYPTION_KEY=')) {
      console.log(envFileContent.includes('STRAPI_ADMIN_ENCRYPTION_KEY='));
      return { success: false, message: 'STRAPI_ADMIN_ENCRYPTION_KEY already exists. No need to generate a new one.' };
    } else {
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
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
};

export default generateEncryptionKeyIfNeeded;
