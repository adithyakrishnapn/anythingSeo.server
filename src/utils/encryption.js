import crypto from 'crypto';

// Hash the encryption key to guarantee it is exactly 32 bytes (256 bits)
const getEncryptionKey = () => {
    const key = process.env.CREDENTIAL_ENCRYPTION_KEY || 'default-secret-encryption-key-for-saas-development-32b';
    return crypto.createHash('sha256').update(key).digest();
};

/**
 * Encrypt a string using AES-256-GCM
 * Returns a colon-separated string: iv:authTag:encryptedHex
 */
export const encrypt = (text) => {
    if (!text) return '';
    const iv = crypto.randomBytes(12); // Standard GCM IV length is 12 bytes
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
};

/**
 * Decrypt a colon-separated AES-256-GCM string
 */
export const decrypt = (encryptedText) => {
    if (!encryptedText) return '';
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
};
