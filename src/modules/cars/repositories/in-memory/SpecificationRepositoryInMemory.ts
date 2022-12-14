import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

import {
    ICreateSpecificationDTO,
    ISpecificationsRepository,
} from "../ISpecificationsRepository";

class SpecificationRepositoryInMemory implements ISpecificationsRepository {
    private specifications: Specification[] = [];

    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = new Specification();

        Object.assign(specification, {
            name,
            description,
        });

        this.specifications.push(specification);

        return specification;
    }
    async findByName(name: string): Promise<Specification> {
        return this.specifications.find((s) => s.name === name);
    }
    async findByIds(ids: string[]): Promise<Specification[]> {
        return this.specifications.filter((s) => ids.includes(s.id));
    }
    async list(): Promise<Specification[]> {
        const all = this.specifications;
        return all;
    }
}

export { SpecificationRepositoryInMemory };
