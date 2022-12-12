import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { autoInjectable, inject } from "tsyringe";

import { AppError } from "../../../../errors/appError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@autoInjectable()
class AuthenticateUserUseCase {
    private usersRepository: IUsersRepository;
    constructor(
        @inject("UsersRepository")
        usersRepository: IUsersRepository
    ) {
        this.usersRepository = usersRepository;
    }

    async execute({ email, password }: IRequest): Promise<IResponse> {
        // Verificando se usuario existe
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Email or password is incorrect.");
        }

        // Verificando se a senha está correta
        const passwordMath = await compare(password, user.password);

        if (!passwordMath) {
            throw new AppError("Email or password is incorrect.");
        }

        // Gerando Token
        const token = sign(
            { email: user.email, id: user.id },
            "91034c6fbf722a72191b40c3bc52f6f4",
            {
                subject: user.id,
                expiresIn: "1d",
            }
        );

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
