import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/infra/http/errors/appError";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateSpecificationUseCase {
    private SpecificationsRepository: ISpecificationsRepository;

    constructor(
        @inject("SpecificationsRepository")
        SpecificationsRepository: ISpecificationsRepository
    ) {
        this.SpecificationsRepository = SpecificationsRepository;
    }

    async execute({ name, description }: IRequest): Promise<Specification> {
        const categoryAlreadyExists =
            await this.SpecificationsRepository.findByName(name);

        if (categoryAlreadyExists) {
            throw new AppError("Category already exists!");
        }

        const specification = await this.SpecificationsRepository.create({
            name,
            description,
        });

        return specification;
    }
}

export { CreateSpecificationUseCase };
