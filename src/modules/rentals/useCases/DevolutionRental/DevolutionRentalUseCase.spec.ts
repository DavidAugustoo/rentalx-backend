import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import dayjs from "dayjs";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/infra/http/errors/appError";

import { CreateRentalUseCase } from "../CreateRental/CreateRentalUseCase";
import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let devolutionRentalUseCase: DevolutionRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Devolution Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        devolutionRentalUseCase = new DevolutionRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to devolution rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Test",
            description: "Car Test",
            daily_rate: 100,
            license_plate: "test",
            fine_amount: 40,
            category_id: "1234",
            brand: "brand",
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        const response = await devolutionRentalUseCase.execute({
            id: rental.id,
        });

        expect(response).toHaveProperty("id");
    });

    it("should not be able to devolution a rental if it not exists", async () => {
        expect(async () => {
            const response = await devolutionRentalUseCase.execute({
                id: "925b9bf6-ecd8-4694-8aaf-89a93dab12cf",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
