import UserRepository from '../repositories/UserRepository';
import CryptoHelper from '../helpers/functions/CryptoHelper';
import MailHelper from '../helpers/functions/MailHelper';

class UserService {
    private userRepository: UserRepository;
    private cryptoHelper: CryptoHelper;
    private mailHelper: MailHelper;

    constructor() {
        this.userRepository = new UserRepository();
        this.cryptoHelper = new CryptoHelper();
        this.mailHelper = new MailHelper({host: process.env.MAIL_HOST, port: parseInt(process.env.MAIL_PORT)})
    }

    public getAllUsers = async () => await this.userRepository.getAllUsers();

    public getUser = async (userId: number) => await this.userRepository.getUser(userId);

    public addUser = async (user: {firstName: string, lastName: string, username: string}) => {
        const initializationToken = this.cryptoHelper.generateToken();

        this.mailHelper.sendMail("dev <dev@localhost>", "dev <dev@localhost>", `You have been invited to join Corsac KMS`,
        `<h1>Welcome to Corsac KMS</h1>
         <p>Your administrator has created an account for you. To join fill in the following data on the website:</p>
         <ul>
         <li>Initialization Token: ${initializationToken.testing}</li>
         <li>Username: ${user.username}</l1>
         </ul>`);

        return await this.userRepository.addUser(user, initializationToken.prod);
    }

    public deleteUser = async (userId: number) => await this.userRepository.deleteUser(userId);
}

export default UserService;