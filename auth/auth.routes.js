import { Router } from 'express';
import { userLogin, userRegistration } from './auth.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validator.js';
import { removeFileOnFailure } from '../middlewares/delete-file-on-error.js';

const authRouter = Router();

authRouter.post(
    '/login',
    validateLogin,
    removeFileOnFailure,
    userLogin
);

authRouter.post(
    '/register',
    validateRegister,
    removeFileOnFailure,
    userRegistration
);

export default authRouter;
