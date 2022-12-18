import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
    });

    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car description",
            brand: "Car Brand",
            license_plate: "DEF-3287",
            daily_rate: 110,
            fine_amount: 40,
            category_id: "category_id",
        });

        const cars = await listCarUseCase.execute({});
        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car1 = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car description",
            brand: "Car Brand Test",
            license_plate: "DEF-3287",
            daily_rate: 110,
            fine_amount: 40,
            category_id: "category_id",
        });

        const cars = await listCarUseCase.execute({
            brand: car1.brand,
        });

        expect(cars).toEqual([car1]);
    });

    it("should be able to list all available cars by name", async () => {
        const car1 = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car description",
            brand: "Car Brand Test",
            license_plate: "DEF-3287",
            daily_rate: 110,
            fine_amount: 40,
            category_id: "category_id",
        });

        const cars = await listCarUseCase.execute({
            brand: car1.name,
        });

        expect(cars).toEqual([car1]);
    });

    it("should be able to list all available cars by category", async () => {
        const car1 = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car description",
            brand: "Car Brand Test",
            license_plate: "DEF-3287",
            daily_rate: 110,
            fine_amount: 40,
            category_id: "12345",
        });

        const cars = await listCarUseCase.execute({
            category_id: car1.category_id,
        });

        expect(cars).toEqual([car1]);
    });
});
