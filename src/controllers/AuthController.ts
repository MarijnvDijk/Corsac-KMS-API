import { Request, Response, Router } from 'express';

import AuthService from '../services/AuthService';
import Dtos from '../data/enums/DtoEnum';
import IController from '../interfaces/IController';
import { mapToDto } from '../helpers/functions/DtoMapper';
import { OperationException, ExceptionEnum } from '../helpers/exceptions/OperationExceptions';

class AuthController implements IController {
    public path = '/auth';

    public router = Router();

    private authService = new AuthService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/initialize/credentials`, this.initializeCredentials);
        this.router.post(`${this.path}/initialize/2fa`, this.initializeTwoFactorAuthentication);
        this.router.post(`${this.path}/login`, this.authenticateUser);
    }

    private initializeCredentials = async (request: Request, response: Response) => {
        try {
            const {initializationToken, username, password, verifyPassword} = request.body;

            if (typeof initializationToken == "undefined" || typeof username == "undefined" || 
                typeof password == "undefined" || typeof verifyPassword == "undefined") {
                return OperationException.MissingParameters(response, ["initializationToken", "username", "password", "verifyPassword"]);
            }

            if (password !== verifyPassword) {
                return OperationException.InvalidParameters(response, ["password", "verifyPassword"], {error: "The submitted passwords are not equal to eachother"});
            }

            const imageUrl: string = await this.authService.initializeCredentials({initializationToken, username, password});            
            const buffer = Buffer.from(imageUrl.split(",")[1], 'base64');
            response.setHeader('Content-Type', 'image/png');
            return response.status(200).send(buffer);
        } catch (e) {
            console.log(e);
            switch(e) {
                case(ExceptionEnum.NotFound): {
                    return OperationException.NotFound(response);
                } 
                case(ExceptionEnum.Forbidden): {
                    return OperationException.Forbidden(response, {error: "The initializationToken is incorrect"})
                }
                default: {
                    return OperationException.ServerError(response);
                }
            }
        }
    }

    private initializeTwoFactorAuthentication = async (request: Request, response: Response) => {
        try {
            const { username, OTP } = request.body;

            if (typeof username == 'undefined' || typeof OTP != 'string') {
                return OperationException.MissingParameters(response, ["username", "OTP"]);
            }

            const success = await this.authService.initializeTwoFactorAuthentication({username}, OTP)

            response.status(200).json({success})
        } catch (e) {
            console.log(e);
            switch (e) {
                case (ExceptionEnum.Forbidden): {
                    return OperationException.Unauthenticated(response, {error: "Invalid OTP code"})
                }
                case (ExceptionEnum.InvalidResult): {
                    return OperationException.Forbidden(response, {error: "Account already initialized"})
                }
                default: {
                    return OperationException.ServerError(response);
                }
            }
        }
    }

    private authenticateUser = async (request: Request, response: Response) => {
        try {
            const { username, password, OTP } = request.body;

            if (typeof username == 'undefined' || typeof password == 'undefined' || typeof OTP == 'undefined')
                return OperationException.MissingParameters(response, ["username", "password", "OTP"]);

            const result = await this.authService.authenticateUser({username, password}, OTP);

            if (result.error) {
                setTimeout(() => {
                    return OperationException.Unauthenticated(response, {error: "Invalid OTP, credentials, or user does not exist"});
                }, 80)
            } else {
                return response.cookie("session", result.session, {
                    maxAge: 3600,
                    path: '/api/',
                    httpOnly: true,
                    secure: true
                }).json({success: true});
            }
        } catch(e) {
            console.log(e);
            switch (e) {
                case (ExceptionEnum.Forbidden): {
                    return OperationException.Forbidden(response, {error: "This account is locked"})
                }
                case (ExceptionEnum.InvalidResult): {
                    return OperationException.Forbidden(response, {error: "Invalid OTP, credentials, or user does not exist"})
                }
                default: {
                    return OperationException.ServerError(response);
                }
            }
        }
    }
}

export default AuthController;