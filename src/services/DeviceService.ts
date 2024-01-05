import DeviceRepository from '../repositories/DeviceRepository';
import CryptoHelper from '../helpers/functions/CryptoHelper';

class DeviceService {
    private deviceRepository: DeviceRepository;
    private cryptoHelper: CryptoHelper;

    constructor() {
        this.deviceRepository = new DeviceRepository();
        this.cryptoHelper = new CryptoHelper();
    }

    public getAllDevices = async () => await this.deviceRepository.getAllDevices();

    public getDevice = async (deviceId: number) => await this.deviceRepository.getDevice(deviceId);

    public addDevice = async (device: {deviceName: string, createdBy: number}) =>
    {
     const deviceGuid = this.cryptoHelper.generateGuid();
     return await this.deviceRepository.addDevice({...device, deviceGuid});
    }

    public deleteDevice = async (deviceId: number) => await this.deviceRepository.deleteDevice(deviceId);
}

export default DeviceService;