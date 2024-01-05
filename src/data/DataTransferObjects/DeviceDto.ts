export default class DeviceDto {
    id: number;
    deviceGuid: string;
    deviceName: string;
    createdAt: EpochTimeStamp;
    createdBy: number;

    constructor(data: any) {
        this.id = data.id;
        this.deviceGuid = data.deviceGuid;
        this.deviceName = data.deviceName;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
    }
}