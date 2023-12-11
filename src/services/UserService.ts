import UserRepository from '../repositories/UserRepository';

class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public getAllUsers = async () => await this.userRepository.getAllUsers();

    public getUser = async (userId: number) => await this.userRepository.getUser(userId);

    public addUser = async (user: {firstName: string, lastName: string, username: string}) =>
     await this.userRepository.addUser(user);

    public deleteUser = async (userId: number) => await this.userRepository.deleteUser(userId);
}

export default UserService;