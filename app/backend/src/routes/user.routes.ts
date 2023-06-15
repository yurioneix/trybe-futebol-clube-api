import { Router } from 'express';
import TokenGeneratorJwt from '../services/TokenGeneratorJWT';
import UserService from '../services/UserService';
import UsersController from '../controllers/UserController';
import EncrypterBcryptService from '../services/BcryptService';
import Validations from '../middlewares/Validations';

const encrypter = new EncrypterBcryptService();
const tokenGenerator = new TokenGeneratorJwt();
const userService = new UserService(encrypter, tokenGenerator);
const userController = new UsersController(userService);

const router = Router();

router.post(
  '/',
  Validations.validateBody,
  Validations.validateEmailAndPassword,
  (req, res) => userController.login(req, res),
);

router.get('/role', Validations.validateToken, (req, res) => userController.getRole(req, res));

export default router;
