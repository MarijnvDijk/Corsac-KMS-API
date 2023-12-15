import helmet from 'helmet';

import IController from './interfaces/IController';
import errorMiddleware from './middlewares/errorMiddleware';
import DatabaseHandler from './repositories/DatabaseHandler';

const { expressjwt: jwt } = require("express-jwt");
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

require('dotenv').config();

const allowedOrigins = ['https://corsac-kms.marijnvandijk.com'];

class App {
  public app;

  public db = new DatabaseHandler();

  constructor(controllers: IController[]) {
    this.app = express();
    this.db.testConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 3000;
    this.app.listen(port, host, () => {
      console.log('info', `Server listening on port ${port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: allowedOrigins,
      }),
    );
    this.app.use(cookieParser());
    
    var publicKey = fs.readFileSync("./certificates/public.pem");
    this.app.use(
      jwt({
        secret: publicKey,
        algorithms: ["RS256"],
        getToken: function getFromCookie(request: any) {
          return request.cookies.session;
        }
      }).unless({ path: ["/api/v1/auth/login"] })
    );
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use('/v1', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;