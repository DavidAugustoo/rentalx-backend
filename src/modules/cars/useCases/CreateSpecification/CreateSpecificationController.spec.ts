import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { dataSource } from "@shared/infra/typeorm";

describe("Create Specification Controller", () => {
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

    it("should be able to create a new specification ", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token } = responseToken.body;

        const response = await request(app)
            .post("/specifications")
            .send({
                name: "Specification Supertest",
                description: "Specification Supertest",
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(201);
    });
});
