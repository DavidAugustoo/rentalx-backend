import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

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
        await this.usersRepository.create({
            name,
            password,
            driver_license,
            email,
        });
    }
}

export { CreateUserUseCase };
