import { Router } from 'express';
import { LoginController } from '../controllers/loginController';
import { checkUser, errorHandler } from '../middleware/index';
import pool from '../config/database';
import { LoginService } from '../service/loginService';

const router = Router();
const loginController = new LoginController(pool,
    new LoginService(pool));
    

router.post('/login', checkUser, loginController.login); // Ensure this route is defined

router.use(errorHandler);

export default router;



