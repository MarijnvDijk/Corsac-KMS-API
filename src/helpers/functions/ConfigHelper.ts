import axios from 'axios';
import { config } from 'dotenv';

class ConfigHelper {
    public baseUrl: string;
    private apiKey: string;

    constructor (baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    public getConfig(configSettings: {deviceName: string, chainId: number}): 
        Promise<{chainId: number, chainroot: string, deviceName: string, sig: {private: string, public: string}}|undefined> {
        return new Promise((resolve, reject) => {
            if (configSettings.deviceName == null || configSettings.chainId == null) {
                reject(null);
            }

            axios.post(`${this.baseUrl}/genConfig`, {"devicename": configSettings.deviceName, "chainid": configSettings.chainId})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err: Error) => {
                    reject(err);
                })
        });
    }
}

export default ConfigHelper;