import { ResetPasswordUserController } from "@modules/accounts/useCases/ResetPasswordUser/ResetPasswordUserController";
import { SendForgotPasswordEmailController } from "@modules/accounts/useCases/SendForgotPasswordMail/SendForgotPasswordMailController";
import { Router } from "express";

const passwordRoutes = Router();

const sendForgotPasswordEmailController =
    new SendForgotPasswordEmailController();

const resetPasswordUserController = new ResetPasswordUserController();

passwordRoutes.post("/forgot", sendForgotPasswordEmailController.handle);
passwordRoutes.post("/reset", resetPasswordUserController.handle);

export { passwordRoutes };
