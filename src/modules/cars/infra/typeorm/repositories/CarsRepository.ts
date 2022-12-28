import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarsDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Repository } from "typeorm";

import { dataSource } from "@shared/infra/typeorm";

import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = dataSource.getRepository(Car);
    }

    async create({
        brand,
        category_id,
        daily_rate,
        description,
        fine_amount,
        license_plate,
        name,
        specifications,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            brand,
            category_id,
            daily_rate,
            description,
            fine_amount,
            license_plate,
            name,
            specifications,
            id,
        });

        await this.repository.save(car);

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOneBy({
            license_plate,
        });

        return car;
    }

    async findAvailable(
        category_id?: string,
        brand?: string,
        name?: string
    ): Promise<Car[]> {
        const carsQuery = this.repository
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.images", "image")
            .where("available = :available", { available: true });

        if (brand) {
            carsQuery.andWhere("c.brand = :brand", { brand });
        }

        if (name) {
            carsQuery.andWhere("c.name = :name", { name });
        }

        if (category_id) {
            carsQuery.andWhere("c.category_id = :category_id", { category_id });
        }

        const cars = carsQuery.getMany();
        return cars;
    }

    findById(id: string): Promise<Car> {
        return this.repository.findOneBy({ id });
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ available })
            .where("id = :id")
            .setParameters({ id })
            .execute();
    }
}

export { CarsRepository };
