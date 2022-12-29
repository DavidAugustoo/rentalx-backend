import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { AppError } from "@shared/infra/http/errors/appError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepository = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepository);
    });

    it("should create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "Name Car",
            brand: "Brand",
            category_id: "category",
            daily_rate: 100,
            description: "Description Car",
            fine_amount: 60,
            license_plate: "ABC-1235",
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a car with exists license plate", async () => {
        expect(async () => {
            const car1 = await createCarUseCase.execute({
                name: "Name Car",
                brand: "Brand",
                category_id: "category",
                daily_rate: 100,
                description: "Description Car",
                fine_amount: 60,
                license_plate: "ABC-1235",
            });

            const car2 = await createCarUseCase.execute({
                name: "Name Car",
                brand: "Brand",
                category_id: "category",
                daily_rate: 100,
                description: "Description Car",
                fine_amount: 60,
                license_plate: "ABC-1235",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a car with available license plate", async () => {
        const car = await createCarUseCase.execute({
            name: "Name Car",
            brand: "Brand",
            category_id: "category",
            daily_rate: 100,
            description: "Description Car",
            fine_amount: 60,
            license_plate: "ABCD-1235",
        });

        expect(car.available).toBe(true);
    });
});
