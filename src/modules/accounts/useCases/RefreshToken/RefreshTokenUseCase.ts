import auth from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/infra/http/errors/appError";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: UsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: DayjsDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        try {
            const { email, sub } = verify(
                token,
                auth.secret_refresh_token
            ) as IPayload;

            const user_id = sub;

            const userToken =
                await this.usersTokensRepository.findByUserIdAndRefreshToken(
                    user_id,
                    token
                );

            if (!userToken) {
                throw new AppError("Refresh token does not exists", 404);
            }

            await this.usersTokensRepository.deleteById(userToken.id);

            const expires_date = this.dateProvider.addDays(
                auth.expires_refresh_token_days
            );

            const refresh_token = sign({ email }, auth.secret_refresh_token, {
                subject: sub,
                expiresIn: auth.expires_in_refresh_token,
            });

            await this.usersTokensRepository.create({
                expires_date,
                refresh_token,
                user_id,
            });

            const newToken = sign({}, auth.secret_token, {
                subject: user_id,
                expiresIn: auth.expires_in_token,
            });

            return { token: newToken, refresh_token };
        } catch (err) {
            console.log(err);
            throw new AppError("Invalid Token", 401);
        }
    }
}

export { RefreshTokenUseCase };
