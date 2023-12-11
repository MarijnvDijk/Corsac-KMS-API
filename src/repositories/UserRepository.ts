import BaseCrudRepository from "./base/BaseCrudRepository";
import { ExceptionEnum } from "../helpers/exceptions/OperationExceptions";
import UserDto from '../data/DataTransferObjects/UserDto';

export default class UserRepository extends BaseCrudRepository {
    constructor() {
        super(['users', 'user_auth']);
    }

    async getAllUsers(): Promise<UserDto[]>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `SELECT id, first_name as firstName, last_name as lastName, username, created_at as createdAt FROM ${this.tableNames[0]}`,
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err);
                        else resolve(res);
                    }
                );
            })
        });
    }

    async getUser(userId: Number): Promise<UserDto>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                  `SELECT id, first_name as firstName, last_name as lastName, username, created_at as createdAt FROM ${this.tableNames[0]} WHERE id = ?`,
                  [userId],
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

    async addUser(user: {firstName: string, lastName: string, username: string}): Promise<{user: Partial<UserDto>, res: any}>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `INSERT INTO ${this.tableNames[0]}(first_name, last_name, username) VALUES(?, ?, ?)`,
                    [user.firstName, user.lastName, user.username],
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err)
                        resolve({user, res});
                    }
                );
            });
        });
    }

    async deleteUser(userId: Number): Promise<Boolean>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `DELETE FROM ${this.tableNames[1]} WHERE user_id = ?`,
                    [userId],
                    (err: Error, _) => {
                        if (err) {
                            connection.release();
                            reject(err)
                        }

                        connection.query(
                            `DELETE FROM ${this.tableNames[0]} WHERE id = ?`,
                            [userId],
                            (err: Error, _) => {
                                connection.release();
                                if (err) reject(err);
                                else resolve(true);[]
                            }
                        )
                    })
            });
        });
    }
}