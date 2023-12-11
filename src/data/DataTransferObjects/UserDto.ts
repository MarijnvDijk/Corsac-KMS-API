export default class UserDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    createdAt: EpochTimeStamp;
    modifiedAt: EpochTimeStamp;
    password: string;
    OTPSecret: any;
    authenticationAttempts: number;
    enabled: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.username = data.username;
        this.createdAt = data.createdAt;
        this.modifiedAt = data.modifiedAt;
        this.password = data.password;
        this.OTPSecret = data.OTPSecret;
        this.authenticationAttempts = data.authenticationAttempts;
        this.enabled = data.enabled;
    }
}