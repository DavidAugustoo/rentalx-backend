import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListSpecificationsUseCase } from "./ListSpecificationsUseCase";

class ListSpecificationsController {
    async handle(request: Request, response: Response) {
        const specificationRepositoryUseCase = container.resolve(
            ListSpecificationsUseCase
        );

        const all = await specificationRepositoryUseCase.execute();

        return response.status(200).json(all);
    }
}

export { ListSpecificationsController };
