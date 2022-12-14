import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@shared/infra/http/errors/appError";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token missing", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id } = verify(
            token,
            "91034c6fbf722a72191b40c3bc52f6f4"
        ) as IPayload;

        const usersRepository = new UsersRepository();
        const userExists = usersRepository.findById(user_id);

        if (!userExists) {
            throw new AppError("User not found", 401);
        }

        request.user = {
            id: user_id,
        };

        next();
    } catch (err) {
        throw new AppError("Invalid Token", 401);
    }
}
