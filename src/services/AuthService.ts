import AuthRepository from "../repositories/AuthRepository";
import UserDto from "../data/DataTransferObjects/UserDto";
import JWTHelper from "../helpers/functions/JWTHelper";

class AuthService {
    private authRepository: AuthRepository;
    private JWTHelper: JWTHelper;

    constructor() {
        this.authRepository = new AuthRepository();
        this.JWTHelper = new JWTHelper();
    }

    public authenticateUser = async (user: Partial<UserDto>): Promise<{error: boolean, session?: string}> => {
        const authInfo = await this.authRepository.getAuthenticationInformation(user.username);
        if (typeof authInfo == 'boolean') {
            return {error: true};
        }
        const result = await this.JWTHelper.verifyCredentials(authInfo, user.password);
        return result;
    }
}

export default AuthService;