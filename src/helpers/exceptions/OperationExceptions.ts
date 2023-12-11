import { Response } from 'express';

class OperationException {
    public static NotFound(response: Response, customMessage?: {error: string}) {
        let message = {"error": "Could not find any records for the requested source"};
        if (customMessage) message = customMessage;
    
        return response.status(404).json(message);
      }

      public static Unauthenticated(response: Response, customMessage?: {error: string}) {
        let message = {"error": "sorry, but you are not authenticated to use this endpoint"};
        if (customMessage) message = customMessage;
    
        return response.status(401).json(message);
      }

      public static ServerError(response: Response, customMessage?: {error: string}) {
        let message = {"error": "an unexpected server error occured and the operation was not successful"};
        if (customMessage) message = customMessage;
        
        return response.status(500).json(message)
      }

      public static MissingParameters(
        response: Response,
        parameters: Array<string>,
      ) {
        let message: {error: string, parameters: string[]} = {"error":"Missing (some) required parameter(s)", "parameters":[]};
        parameters.forEach((param) => {
          message.parameters.push(param);
        });
    
        return response.status(400).json(message);
      }

      public static InvalidParameters(
        response: Response,
        parameters: Array<string>,
      ) {
        let message: {error: string, parameters: string[]} = {"error":"Invalid parameter(s)", "parameters":[]};

        parameters.forEach((param) => {
            message.parameters.push(param);
          });
      
          return response.status(400).json(message);
      }
}

enum ExceptionEnum {
    NotFound = 'NotFound',
    InvalidResult = 'InvalidResult'
}

export {ExceptionEnum, OperationException};