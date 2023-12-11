import { Pool } from 'mysql2';

const mysql = require('mysql2')

export default class DatabaseHandler {
    private pool: Pool
    private prepPool: Pool

    constructor(prepMode: boolean = false) {
        if (prepMode == false) {
            this.pool = this.getPool();
        } else {
            this.prepPool = this.getPrepPool()
        }
    }

    public getPool() {
        if (this.pool) return this.pool;
        this.pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DATABASE,
          connectionLimit: 100,
        });
        return this.pool;
    }

    private getPrepPool() {
        if (this.prepPool) return this.prepPool;
        this.prepPool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DATABASE,
          connectionLimit: 5,
          multipleStatements: true,
        });
        return this.prepPool;
    }

    public async testConnection(): Promise<Error|boolean> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err, connection) {
                if (err) reject(err);

                if (typeof connection != 'undefined') {
                    connection.release();
                    resolve(true);
                }
            });
        });
    }

    public async prepDatabase(lines: any): Promise<Error|boolean> {
        return new Promise((resolve, reject) => {
            this.prepPool.getConnection((err, connection) => {
                if (err) reject(err);

                connection.query(
                    lines,
                    (err: Error) => {
                        connection.release();
                        if (err) throw(err);
                        resolve(true);
                    })
            });
        });
    }
}