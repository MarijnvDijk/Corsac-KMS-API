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
        this.router.post(`${this.path}/login`, this.authenticateUser);
    }

    private authenticateUser = async (request: Request, response: Response) => {
        try {
            const { username, password } = request.body;

            if (typeof username == 'undefined' || typeof password == 'undefined')
                return OperationException.MissingParameters(response, ["username", "password"]);

            const result = await this.authService.authenticateUser({username, password});

            if (result.error) {
                setTimeout(() => {
                    return OperationException.Unauthenticated(response, {error: "Invalid credentials or user does not exist"});
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
            return OperationException.ServerError(response);
        }
    }
}

export default AuthController;