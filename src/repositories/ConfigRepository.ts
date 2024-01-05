import BaseCrudRepository from "./base/BaseCrudRepository";
import { ExceptionEnum } from "../helpers/exceptions/OperationExceptions";

export default class ConfigRepository extends BaseCrudRepository {
    constructor() {
        super(['configurations', 'devices']);
    }

    async getConfigsForDevice(deviceName: string): Promise<Array<{id: number, configurationNumber: number, deviceName: string}>>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `SELECT configurations.id, configuration_number as configurationNumber, device_name as DeviceName 
                        FROM ${this.tableNames[0]} INNER JOIN ${this.tableNames[1]} ON 
                        ${this.tableNames[0]}.device_id = ${this.tableNames[1]}.id WHERE ${this.tableNames[1]}.device_name = ?`,
                    [deviceName],
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err)

                        if (res.length == 0) reject(ExceptionEnum.NotFound);
                        else resolve(res);
                    }
                )
            })
        })
    }

    async addConfig(device: {deviceId: number}, config: {chainId: number, encryptionKey: {data: string, iv: string},
            sig: {public: string, private: {data: string, iv: string}}}): Promise<Boolean>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `INSERT INTO ${this.tableNames[0]}(configuration_number, device_id, encryption_key, signature_keys) VALUES(?, ?, ?, ?)`,
                    [config.chainId, device.deviceId, JSON.stringify(config.encryptionKey), JSON.stringify(config.sig)],
                    (err: Error, _: any) => {
                        connection.release();
                        if (err) reject(err);
                        else resolve(true);
                    }
                )
            });
        });
    }

    async deleteConfig(configProps: {deviceId: number, configurationNumber: number}): Promise<Boolean>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `DELETE FROM ${this.tableNames[0]} WHERE configuration_number = ? AND device_id = ?`,
                    [configProps.configurationNumber, configProps.deviceId],
                    (err: Error, _) => {
                        connection.release();
                        if (err) reject(err)
                        else resolve(true);
                    })
            });
        });
    }

    async getLastChainId(device: {deviceName: string}): Promise<{deviceId: number, configurationNumber: number}>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `SELECT id as deviceId FROM ${this.tableNames[1]} WHERE device_name = ?`,
                    [device.deviceName],
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err);
                        if (res.length == 0) reject(ExceptionEnum.NotFound);
                        else {
                            let deviceId = res[0].deviceId;

                            connection.query(
                                `SELECT configuration_number as configurationNumber FROM ${this.tableNames[0]} INNER JOIN 
                                 ${this.tableNames[1]} ON ${this.tableNames[1]}.id = ${this.tableNames[0]}.device_id WHERE device_id = ? ORDER BY configurationNumber DESC LIMIT 1`,
                                [deviceId],
                                (err: Error, res: any) => {
                                    if (err) {
                                        connection.release();
                                        reject(err);
                                    }

                                    if (res.length == 0) resolve({deviceId, configurationNumber: 0});
                                    else resolve({deviceId, configurationNumber: res[0].configurationNumber});
                                }   
                            )
                        }
                    }
                )
            });
        });
    }
}