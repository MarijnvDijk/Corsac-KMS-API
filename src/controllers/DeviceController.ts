import { Response, Router } from 'express';
import { Request } from 'express-jwt';

import Dtos from '../data/enums/DtoEnum';
import IController from '../interfaces/IController';
import {OperationException, ExceptionEnum} from '../helpers/exceptions/OperationExceptions';
import DeviceService from '../services/DeviceService';
import { mapToDto } from '../helpers/functions/DtoMapper';

class DeviceController implements IController {
    public path = '/devices';

    public router = Router();

    private deviceService = new DeviceService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getDevices);
        this.router.get(`${this.path}/:id`, this.getDevice);
        this.router.post(`${this.path}`, this.createDevice);
        // this.router.put(`${this.path}`, this.updateDevice);
        this.router.delete(`${this.path}/:id`, this.deleteDevice);
    }

    private getDevices = async (request: Request, response: Response) => {
        try {
            const devices = await this.deviceService.getAllDevices();
            return response.status(200).json(mapToDto(devices, Dtos.DeviceDto));
        } catch (e) {
            console.log(e);
            return OperationException.ServerError(response);
        }
    }

    private getDevice = async (request: Request, response: Response) => {
        try {
            const {id} = request.params;

            if (!isNaN(parseInt(id))) {
                const device = await this.deviceService.getDevice(parseInt(id));
                return response.status(200).json(mapToDto(device, Dtos.DeviceDto));
            } else {
                return OperationException.InvalidParameters(response, ["id"])
            }
        } catch (e) {
            console.log(e);
            switch(e) {
                case(ExceptionEnum.NotFound): {
                    return OperationException.NotFound(response);
                } 
                case(ExceptionEnum.InvalidResult): {
                    return OperationException.ServerError(response);
                }
                default: {
                    return OperationException.ServerError(response);
                }
            }
        }
    }

    private createDevice = async (request: Request, response: Response) => {
        try {
            const {deviceName} = request.body;
            if (typeof deviceName == 'undefined') {
                return OperationException.MissingParameters(response, ["deviceName"]);
            }
            
            const {device} = await this.deviceService.addDevice({deviceName, "createdBy": request.auth.id});
            return response.status(200).json(mapToDto(device, Dtos.DeviceDto));
        } catch (e) {
            console.log(e);
            return OperationException.ServerError(response);
        }
    }

    private deleteDevice = async (request: Request, response: Response) => {
        try {
            const {id} = request.params;

            if (!isNaN(parseInt(id))) {
                const success = await this.deviceService.deleteDevice(parseInt(id));
                return response.status(200).json({"success": success});
            } else {
                return OperationException.InvalidParameters(response, ["id"])
            }
        } catch (e) {
            console.log(e);
            return OperationException.ServerError(response);
        }
    }
}

export default DeviceController;