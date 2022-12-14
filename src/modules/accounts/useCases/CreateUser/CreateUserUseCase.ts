import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/infra/http/errors/appError";

@injectable()
class CreateUserUseCase {
    private usersRepository: IUsersRepository;

    constructor(
        @inject("UsersRepository")
        usersRepository: IUsersRepository
    ) {
        this.usersRepository = usersRepository;
    }

    async execute({
        name,
        password,
        driver_license,
        email,
    }: ICreateUserDTO): Promise<void> {
        const passwordHash = await hash(password, 8);

        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new AppError("User already exists");
        }

        await this.usersRepository.create({
            name,
            password: passwordHash,
            driver_license,
            email,
        });
    }
}

export { CreateUserUseCase };
