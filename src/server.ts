import App from './app';
import AuthController from './controllers/AuthController';
import ConfigController from './controllers/ConfigController';
import DeviceController from './controllers/DeviceController';
import UserController from './controllers/UserController';

const app = new App(
	[
		new AuthController(),
		new ConfigController(),
		new DeviceController(),
		new UserController(),
	],
);

app.listen();
