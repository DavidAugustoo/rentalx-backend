import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/appError";
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

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

    async execute({ name, description }: IRequest): Promise<void> {
        const categoryAlreadyExists =
            await this.SpecificationsRepository.findByName(name);

        if (categoryAlreadyExists) {
            throw new AppError("Category already exists!");
        }

        await this.SpecificationsRepository.create({ name, description });
    }
}

export { CreateSpecificationUseCase };
