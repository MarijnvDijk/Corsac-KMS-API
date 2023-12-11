import BaseCrudRepository from "./base/BaseCrudRepository";
import { ExceptionEnum } from "../helpers/exceptions/OperationExceptions";
import UserDto from '../data/DataTransferObjects/UserDto';

export default class AuthRepository extends BaseCrudRepository {
    constructor() {
        super(['user_auth', 'users']);
    }

    async getAuthenticationInformation(username: string): Promise<UserDto|boolean>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `SELECT user_id as id, username as username, password, OTP_Secret as OTPSecret, authentication_attempts as authenticationAttempts, locked FROM 
                      ${this.tableNames[0]} INNER JOIN ${this.tableNames[1]} ON id = user_id WHERE username = ?`,
                    [username],
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err);
                        if (res.length == 1) resolve(res[0])
                        else resolve(false);
                    }
                );
            })
        });
    }

    async addUser(user: Partial<UserDto>): Promise<Error|boolean>|undefined {
        return new Promise((resolve, reject) => {
            this.db.getPool().getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    `INSERT INTO ${this.tableNames[0]}(user_id, password, OTP_secret) VALUES(?, ?, ?)`,
                    [user.id, user.password, user.OTPSecret],
                    (err: Error, res: any) => {
                        connection.release();
                        if (err) reject(err);
                        else resolve(res);
                    }
                )
            });
        });
    }
}