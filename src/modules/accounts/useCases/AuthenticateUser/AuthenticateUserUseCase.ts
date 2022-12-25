import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { autoInjectable, inject } from "tsyringe";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/infra/http/errors/appError";

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
    refresh_token: string;
}

@autoInjectable()
class AuthenticateUserUseCase {
    private usersRepository: IUsersRepository;
    private usersTokensRepository: IUsersTokensRepository;

    constructor(
        @inject("UsersRepository")
        usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        usersTokenRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {
        this.usersRepository = usersRepository;
        this.usersTokensRepository = usersTokenRepository;
    }

    async execute({ email, password }: IRequest): Promise<IResponse> {
        // Verificando se usuario existe
        const user = await this.usersRepository.findByEmail(email);
        const {
            expires_in_token,
            secret_refresh_token,
            secret_token,
            expires_in_refresh_token,
            expires_refresh_token_days,
        } = auth;

        if (!user) {
            throw new AppError("Email or password is incorrect.");
        }

        // Verificando se a senha está correta
        const passwordMath = await compare(password, user.password);

        if (!passwordMath) {
            throw new AppError("Email or password is incorrect.");
        }

        // Gerando Token
        const token = sign({ email: user.email, id: user.id }, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token,
        });

        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token,
        });

        const refresh_token_expires_date = this.dateProvider.addDays(
            expires_refresh_token_days
        );

        await this.usersTokensRepository.create({
            user_id: user.id,
            refresh_token,
            expires_date: refresh_token_expires_date,
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
            refresh_token,
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
