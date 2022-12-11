import { ISpecificationsRepository } from "../repositories/ISpecificationsRepository";

interface IRequest {
    name: string;
    description: string;
}

class CreateSpecificationService {
    private SpecificationsRepository: ISpecificationsRepository;

    constructor(SpecificationsRepository: ISpecificationsRepository) {
        this.SpecificationsRepository = SpecificationsRepository;
    }

    execute({ name, description }: IRequest): void {
        const specificationAlreadyExists =
            this.SpecificationsRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new Error("Specification already exists");
        }

        this.SpecificationsRepository.create({ name, description });
    }
}

export { CreateSpecificationService };
