import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "postgres",
    host: process.env.NODE_ENV === "test" ? "localhost" : "localhost", // Nome dado ao service do banco de dados
    port: 5432,
    username: "docker",
    password: "ignite",
    database: process.env.NODE_ENV === "test" ? "rentx_test" : "rentx_test",
    entities: ["./src/modules/**/entities/*.ts"],
    migrations: ["src/shared/infra/typeorm/migrations/*.ts"],
});

dataSource
    .initialize()
    .then(async () => {
        console.log("Initializing the database...");
    })
    .catch((err) => console.log(err));
