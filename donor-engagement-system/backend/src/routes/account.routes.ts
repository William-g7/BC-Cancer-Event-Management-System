import { Router } from 'express';
import pool from '../config/database';
import { AccountController } from '../controllers/account.controller'; // Ensure this file exists

const router = Router();
const accountController = new AccountController(pool);

export default router;
