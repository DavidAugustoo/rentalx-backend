import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import dotenv from "dotenv";
import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/infra/http/errors/appError";

dotenv.config();

@injectable()
class SendForgotPasswordEmailUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokenRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("EtherealMailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "views",
            "emails",
            "forgotPassword.hbs"
        );

        if (!user) {
            throw new AppError("User does not exists");
        }

        const token = uuidV4();

        const expires_date = this.dateProvider.addHours(3);

        await this.usersTokenRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date,
        });

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`,
        };

        await this.mailProvider.sendMail(
            email,
            "Recuperação de senha",
            variables,
            templatePath
        );
    }
}

export { SendForgotPasswordEmailUseCase };
