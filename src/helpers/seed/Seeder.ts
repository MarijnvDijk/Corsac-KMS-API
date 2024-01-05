import { faker } from '@faker-js/faker';

const { authenticator } = require('otplib')
const bcrypt = require('bcrypt');
const cliProgress = require('cli-progress');
const fs = require('fs');

require('dotenv').config();

import AuthRepository from '../../repositories/AuthRepository';
import CryptoHelper from '../functions/CryptoHelper';
import DatabaseHandler from '../../repositories/DatabaseHandler';
import UserRepository from '../../repositories/UserRepository';

class Seeder {
    private authRepository = new AuthRepository();
    private userRepository = new UserRepository();
    private cryptoHelper = new CryptoHelper();

    private db = new DatabaseHandler(true);

    constructor() {
        faker.seed(1898);
    }

    public seed = async () => {
        const progress = new cliProgress.SingleBar({stopOnComplete: true}, cliProgress.Presets.shades_classic);

        let userAmount = 5;

        progress.start(1 + 2*userAmount, 0);

        // Clearing Database
        await this.clearDatabase();
        progress.increment();
        
        // Adding Users
        let userIds: number[] = await this.generateUsers(userAmount, progress);

        // Adding authentication data
        await this.configureAuthentication(userIds, progress);

    }

    private clearDatabase = async () => {
        const dbScheme = fs.readFileSync('KMS-DEV.sql', { encoding: 'utf8', flag: 'r' }).split("\n").join(" ");
        await this.db.prepDatabase(dbScheme);
    }

    private generateUsers = async (amount: number, progress: any): Promise<number[]> => {
        let userIds = []

        try {
            for (let i = 0; i < amount; i++) {
                let firstName = faker.person.firstName();
                let lastName = faker.person.lastName();
                let username = faker.internet.userName({firstName, lastName});

                let information = await this.userRepository.addUserLegacy({firstName, lastName, username});
                userIds.push(information.res.insertId)
                progress.increment()
            }
            return userIds;
        } catch (e) {
            console.log(e)
        }
    }

    private configureAuthentication = async (userIds: number[], progress: any) => {
        userIds.forEach(async (userId: number) => {
            let hash = bcrypt.hashSync("Password123!", 10);
            // let OTPSecret = authenticator.generateSecret();
            let OTPSecret = process.env.DEV_OTP_SECRET;
            let enc = this.cryptoHelper.encrypt(OTPSecret);
            let user = {id: userId, password: hash, OTPSecret: `{"data":"${enc.data}","iv":"${enc.iv}"}`}
            await this.authRepository.addUser(user);
            progress.increment();
        })
    }
}

const seeder = new Seeder();
seeder.seed();