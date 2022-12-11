import { inject, injectable } from "tsyringe";

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

    execute({ name, description }: IRequest): void {
        const categoryAlreadyExists =
            this.SpecificationsRepository.findByName(name);

        if (categoryAlreadyExists) {
            throw new Error("Category already exists!");
        }

        this.SpecificationsRepository.create({ name, description });
    }
}

export { CreateSpecificationUseCase };
