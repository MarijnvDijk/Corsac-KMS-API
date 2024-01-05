export default class UserDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    createdAt: EpochTimeStamp;
    modifiedAt: EpochTimeStamp;
    password: string;
    OTPSecret: any;
    initializationToken: string;
    authenticationAttempts: number;
    locked: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.username = data.username;
        this.createdAt = data.createdAt;
        this.modifiedAt = data.modifiedAt;
        this.password = data.password;
        this.OTPSecret = data.OTPSecret;
        this.initializationToken = data.initializationToken;
        this.authenticationAttempts = data.authenticationAttempts;
        this.locked = data.enabled;
    }
}