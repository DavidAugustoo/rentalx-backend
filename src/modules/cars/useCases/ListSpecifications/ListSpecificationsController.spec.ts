import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { dataSource } from "@shared/infra/typeorm";

describe("List Specifications Controller", () => {
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

    it("should be able to list all specifications ", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token } = responseToken.body;

        await request(app)
            .post("/specifications")
            .send({
                name: "Specification Supertest",
                description: "Specification Supertest",
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        const response = await request(app)
            .get("/specifications")
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.body[0]).toHaveProperty("id");
    });
});
