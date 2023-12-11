import App from './app';
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';

const app = new App(
	[
		new AuthController(),
		new UserController(),
	],
);

app.listen();
