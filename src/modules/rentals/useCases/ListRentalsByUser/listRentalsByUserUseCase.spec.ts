import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import dayjs from "dayjs";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { CreateRentalUseCase } from "../CreateRental/CreateRentalUseCase";
import { ListRentalsByUserUseCase } from "./listRentalsByUserUseCase";

let createRentalUseCase: CreateRentalUseCase;
let listRentalsByUseCase: ListRentalsByUserUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("List Rentals By User", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listRentalsByUseCase = new ListRentalsByUserUseCase(
            rentalsRepositoryInMemory
        );
        dayjsDateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to list rentals", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Test",
            description: "Car Test",
            daily_rate: 100,
            license_plate: "test",
            fine_amount: 40,
            category_id: "1234",
            brand: "brand",
        });

        const rental = {
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        };

        await createRentalUseCase.execute(rental);

        const response = await listRentalsByUseCase.execute(rental.user_id);

        expect(response.length).toBe(1);
        expect(response[0]).toHaveProperty("id");
    });
});
