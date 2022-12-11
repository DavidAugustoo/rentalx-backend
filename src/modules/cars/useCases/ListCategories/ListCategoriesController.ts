import { Request, Response } from "express";

import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {
    private listCategoriesUseCase: ListCategoriesUseCase;

    constructor(listCategoriesUseCase: ListCategoriesUseCase) {
        this.listCategoriesUseCase = listCategoriesUseCase;
    }

    async handle(request: Request, response: Response): Promise<Response> {
        const all = await this.listCategoriesUseCase.execute();

        return response.status(200).json({ all });
    }
}

export { ListCategoriesController };
