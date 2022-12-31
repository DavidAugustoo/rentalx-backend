import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { dataSource } from "@shared/infra/typeorm";

describe("Refresh Token Controller", () => {
    beforeAll(async () => {
        const id = uuidV4();
        const password = await hash("admin", 8);

        await dataSource.initialize().then(async () => {
            await dataSource.runMigrations();

            await dataSource.query(
                `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
            values('${id}', 'admin', 'admin@rentx.com', '${password}', 'true', 'now()', 'XXXYYY')`
            );
        });
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        await dataSource.destroy();
    });

    it("should be able to refresh token", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token, refresh_token } = responseToken.body;

        const response = await request(app)
            .post("/refresh-token")
            .send({ token: refresh_token });

        expect(response.status).toBe(200);
    });

    it("should not be able refresh token invalid", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token } = responseToken.body;

        const refresh_token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHJlbnR4LmNvbSIsImlhdCI6MTY3MjI3OTYzNywiZXhwIjoxNjc0ODcxNjM3LCJzdWIiOiI2OTEwNWZiNy04MzMxLTQ3MGYtOGQ5NC0zZTAzNmY0OWJhZTYifQ.STLM0s8VFeLjyKMi3Dj5rQV1MTaULZRcYY5H2Zm8BBw";

        const response = await request(app)
            .post("/refresh-token")
            .send({ token: refresh_token });

        expect(response.status).toBe(404);
    });
});
