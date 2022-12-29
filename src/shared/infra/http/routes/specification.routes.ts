import { CreateSpecificationController } from "@modules/cars/useCases/CreateSpecification/CreateSpecificationController";
import { ListSpecificationsController } from "@modules/cars/useCases/ListSpecifications/ListSpecificationsController";
import { Router } from "express";

import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();

specificationsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createSpecificationController.handle
);

specificationsRoutes.get(
    "/",
    ensureAuthenticated,
    listSpecificationsController.handle
);

export { specificationsRoutes };
