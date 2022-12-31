import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

import { AppError } from "@shared/infra/http/errors/appError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe("Create User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to create a new user", async () => {
        const user = {
            name: "User Test",
            email: "test@jest.com",
            password: "test",
            driver_license: "ABC-123",
        };

        await createUserUseCase.execute(user);

        const response = await usersRepositoryInMemory.findByEmail(user.email);

        expect(response.email).toEqual(user.email);
    });

    it("should not be able create a new user with email exists", async () => {
        const user = {
            name: "User Test",
            email: "test@jest.com",
            password: "test",
            driver_license: "ABC-123",
        };

        await usersRepositoryInMemory.create(user);

        expect(async () => {
            await createUserUseCase.execute(user);
        }).rejects.toEqual(new AppError("User already exists"));
    });
});
