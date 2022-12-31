import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { dataSource } from "@shared/infra/typeorm";

describe("List Available Cars Controller", () => {
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

    it("should be able to list all available cars ", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });

        const { token } = responseToken.body;

        const category = await request(app)
            .post("/categories")
            .send({
                name: "SUVVV",
                description: "Quatro portas",
            })
            .set("Authorization", `Bearer ${token}`);

        const car = await request(app)
            .post("/cars")
            .send({
                name: "BMW i8",
                brand: "BMW",
                category_id: category.body.id,
                daily_rate: 1000,
                description: "Carro híbrido de alta performance",
                fine_amount: 600,
                license_plate: "ABC-1235",
            })
            .set("Authorization", `Bearer ${token}`);

        const response = await request(app)
            .get("/cars/available")
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.body[0]).toHaveProperty("id");
    });
});
