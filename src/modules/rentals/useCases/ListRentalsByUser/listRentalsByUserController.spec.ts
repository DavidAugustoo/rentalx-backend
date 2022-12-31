import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { dataSource } from "@shared/infra/typeorm";

describe("List Rentals By User Controller", () => {
    let id: string;

    beforeAll(async () => {
        id = uuidV4();
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

    it("should be able to create a rental", async () => {
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

        await request(app)
            .post("/rentals")
            .send({
                car_id: car.body.id,
                expected_return_date: "2030-12-29T19:59:46.997Z",
            })
            .set("Authorization", `Bearer ${token}`);

        const response = await request(app)
            .get(`/rentals/user/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0].car_id).toBe(car.body.id);
    });
});
