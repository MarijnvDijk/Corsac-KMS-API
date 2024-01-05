const crypto = require('crypto');

import { randomBytes } from 'crypto'

class CryptoHelper {
    private algo: string;

    constructor(algo: string = 'aes-256-cbc') {
        this.algo = algo
    }

    public encrypt(data: string): {data: string, iv: string} {
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(this.algo, Buffer.from(process.env.ENC_KEY, 'hex'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {data: encrypted.toString('hex'), iv: iv.toString('hex')};
    }

    public decrypt(data: {data: string, iv: string}): string {
        const iv = Buffer.from(data.iv, 'hex');
        const enc = Buffer.from(data.data, 'hex');
        let decipher = crypto.createDecipheriv(this.algo, Buffer.from(process.env.ENC_KEY, 'hex'), iv);
        let decrypted = decipher.update(enc);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    public generateGuid(): string {
        return crypto.randomUUID();
    }

    public generateToken(): {prod: {data: string, iv: string}, testing: string} {
        const initializationToken = randomBytes(32).toString('hex');
        return {prod: this.encrypt(initializationToken), testing: initializationToken};
    }
}

export default CryptoHelper;