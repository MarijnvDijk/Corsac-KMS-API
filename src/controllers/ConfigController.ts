import { Response, Router } from 'express';
import { Request } from 'express-jwt';

import IController from '../interfaces/IController';
import {OperationException, ExceptionEnum} from '../helpers/exceptions/OperationExceptions';
import ConfigService from '../services/ConfigService';
import DeviceDto from '../data/DataTransferObjects/DeviceDto';

class ConfigController implements IController {
    public path = '/configs';

    public router = Router();

    private configService = new ConfigService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getConfigsForDevice)
        this.router.post(`${this.path}`, this.createConfig);
        this.router.delete(`${this.path}/:configurationNumber`, this.deleteConfig);
    }

    private getConfigsForDevice = async (request: Request, response: Response) => {
        try {
            const {deviceName} = request.query;

            if (typeof deviceName != "string") {
                return OperationException.MissingParameters(response, ["deviceName"]);
            }

            return response.status(200).json(await this.configService.getConfigsForDevice(deviceName));
        } catch (e) {
            console.log(e)
            switch(e) {
                case(ExceptionEnum.NotFound): {
                    return OperationException.NotFound(response);
                } 
                default: {
                    return OperationException.ServerError(response);
                }
            }
        }
    }

    private createConfig = async (request: Request, response: Response) => {
        try {
            const {deviceName} = request.body;

            if (typeof deviceName == 'undefined') {
                return OperationException.MissingParameters(response, ["deviceName"]);
            }

            const config = await this.configService.createConfig({deviceName})

            const buffer = Buffer.from(JSON.stringify(config), 'binary');

            response.setHeader('Content-Type', 'application/octet-stream');
            response.setHeader('Content-Disposition', 'attachment; filename=config.json');

            response.status(200).send(buffer);
        } catch (e) {
            console.log(e)
            switch(e) {
                case(ExceptionEnum.NotFound): {
                    return OperationException.NotFound(response);
                } 
                default: {
                    return OperationException.ServerError(response);
                }
            }
        }
    }

    private deleteConfig = async (request: Request, response: Response) => {
        try {
            const {configurationNumber} = request.params;
            const {deviceName} = request.body;

            if (typeof deviceName == 'undefined') {
                return OperationException.MissingParameters(response, ["deviceName"]);
            }

            if (!isNaN(parseInt(configurationNumber))) {
                const success = await this.configService.deleteConfig({deviceName, configurationNumber: parseInt(configurationNumber)});
                return response.status(200).json({"success": success});
            } else {
                return OperationException.InvalidParameters(response, ["configurationNumber"])
            }
        } catch (e) {
            console.log(e);
            switch(e) {
                case(ExceptionEnum.NotFound): {
                    return OperationException.NotFound(response);
                } 
                default: {
                    return OperationException.ServerError(response);
                }
            }        
        }
    }
}

export default ConfigController;