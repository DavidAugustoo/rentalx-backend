import { DeleteQueryBuilder } from "typeorm";

import { ICreateUserTokenDTO } from "../dtos/ICreateUsersTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserToken";

interface IUsersTokensRepository {
    create({
        expires_date,
        refresh_token,
        user_id,
    }: ICreateUserTokenDTO): Promise<UserTokens>;
    findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens>;
    findByRefreshToken(refresh_token: string): Promise<UserTokens>;
    deleteById(id: string): Promise<void>;
}

export { IUsersTokensRepository };
