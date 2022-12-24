import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListRentalsByUserUseCase } from "./listRentalsByUserUseCase";

class ListRentalsByUserController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        const listRentalsByUserUseCase = container.resolve(
            ListRentalsByUserUseCase
        );

        const listRentals = await listRentalsByUserUseCase.execute(id);

        return response.status(200).json(listRentals);
    }
}

export { ListRentalsByUserController };
