import BaseCrudRepository from "./base/BaseCrudRepository";
import { ExceptionEnum } from "../helpers/exceptions/OperationExceptions";
import DeviceDto from '../data/DataTransferObjects/DeviceDto';

export default class DeviceRepository extends BaseCrudRepository {
    constructor() {
        super(['devices']);
    }

    async getAllDevices(): Promise<DeviceDto[]>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `SELECT id, device_guid as deviceGuid, device_name as deviceName, created_at as createdAt, created_by as createdBy FROM ${this.tableNames[0]}`,
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err);
                        else resolve(res);
                    }
                );
            })
        });
    }

    async getDevice(deviceId: Number): Promise<DeviceDto>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                  `SELECT id, device_guid as deviceGuid, device_name as deviceName, created_at as createdAt, created_by as createdBy FROM ${this.tableNames[0]} WHERE id = ?`,
                  [deviceId],
                  (err: Error, res: any) => {
                    connection.release();
                    if (err) reject(err);
                    res.length == 0 ? reject(ExceptionEnum.NotFound) : '';
                    res.length == 1 ? resolve(res[0]): reject(ExceptionEnum.InvalidResult);
                  }
                );
            });
        });
    }

    async getDeviceByName(deviceName: string): Promise<DeviceDto>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                  `SELECT id, device_guid as deviceGuid, device_name as deviceName, created_at as createdAt, created_by as createdBy FROM ${this.tableNames[0]} WHERE device_name = ?`,
                  [deviceName],
                  (err: Error, res: any) => {
                    connection.release();
                    if (err) reject(err);
                    res.length == 0 ? reject(ExceptionEnum.NotFound) : '';
                    res.length == 1 ? resolve(res[0]): reject(ExceptionEnum.InvalidResult);
                  }
                );
            });
        });
    }

    async addDevice(device: {deviceGuid: string, deviceName: string, createdBy: number}): Promise<{device: Partial<DeviceDto>, res: any}>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `INSERT INTO ${this.tableNames[0]}(device_guid, device_name, created_by) VALUES(?, ?, ?)`,
                    [device.deviceGuid, device.deviceName, device.createdBy],
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err);
                        resolve({device, res});
                    }
                );
            });
        });
    }

    async deleteDevice(deviceId: Number): Promise<Boolean>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `DELETE FROM ${this.tableNames[0]} WHERE id = ?`,
                    [deviceId],
                    (err: Error, _) => {
                        connection.release();
                        if (err) reject(err);
                        else resolve(true);
                    })
            });
        });
    }
}