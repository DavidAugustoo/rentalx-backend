import { Request, Response } from "express";
import { request } from "http";
import { container } from "tsyringe";

import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

class DevolutionRentalController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: user_id } = request.user;
        const { id } = request.params;

        const devolutionRentalUseCase = container.resolve(
            DevolutionRentalUseCase
        );

        const rental = await devolutionRentalUseCase.execute({ id });

        return response.status(200).json(rental);
    }
}

export { DevolutionRentalController };
