import { SendForgotPasswordEmailController } from "@modules/accounts/useCases/SendForgotPasswordMail/SendForgotPasswordMailController";
import { Router } from "express";

const passwordRoutes = Router();

const sendForgotPasswordEmailController =
    new SendForgotPasswordEmailController();

passwordRoutes.post("/forgot", sendForgotPasswordEmailController.handle);

export { passwordRoutes };
