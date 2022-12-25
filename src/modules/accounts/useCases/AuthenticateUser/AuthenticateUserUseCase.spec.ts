import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/in-memory/UsersRepositoryInMemory";

import { AppError } from "@shared/infra/http/errors/appError";

import { CreateUserUseCase } from "../CreateUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeAll(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "00123",
            email: "teste@test.com",
            password: "teste123",
            name: "user test",
        };

        await createUserUseCase.execute(user);

        const token = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(token).toHaveProperty("token");
    });

    it("should not be able to authenticate an nonexistent user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "teste@test.com",
                password: "password123",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate an invalid password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: "00123",
                email: "teste@test.com",
                password: "teste123",
                name: "user test",
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "invalid",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
