import ConfigRepository from '../repositories/ConfigRepository';
import CryptoHelper from '../helpers/functions/CryptoHelper';
import ConfigHelper from '../helpers/functions/ConfigHelper';
import DeviceRepository from '../repositories/DeviceRepository';

class DeviceService {
    private configRepository: ConfigRepository;
    private configHelper: ConfigHelper;
    private cryptoHelper: CryptoHelper;
    private deviceRepository: DeviceRepository;

    constructor() {
        this.configRepository = new ConfigRepository();
        this.configHelper = new ConfigHelper(process.env.BASE_URL, process.env.APIKEY);
        this.cryptoHelper = new CryptoHelper();
        this.deviceRepository = new DeviceRepository();
    }

    public getConfigsForDevice = async (deviceName: string) => await this.configRepository.getConfigsForDevice(deviceName);

    public createConfig = async (device: {deviceName: string}) => {
        const configSettings = await this.configRepository.getLastChainId({...device});
        let configurationNumber = configSettings.configurationNumber += 1;
        const config = await this.configHelper.getConfig({chainId: configurationNumber, ...device});

        if (typeof config == "undefined") {
            throw new Error("Could not get a configuration");
        }

        const privateKey = this.cryptoHelper.encrypt(config.sig.private);
        const encryptionKey = this.cryptoHelper.encrypt(config.chainroot);

        await this.configRepository.addConfig({deviceId: configSettings.deviceId}, {chainId: config.chainId, sig: {public: config.sig.public, private: privateKey}, encryptionKey});
        return config;
    }

    public deleteConfig = async (config: {deviceName: string, configurationNumber: number}) => {
        const device = await this.deviceRepository.getDeviceByName(config.deviceName);

        return await this.configRepository.deleteConfig({deviceId: device.id, configurationNumber: config.configurationNumber});
    }
}

export default DeviceService;