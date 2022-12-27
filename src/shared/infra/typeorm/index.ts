import { DataSource } from "typeorm";

enum Host {
    test = "localhost",
    typeorm = "localhost",
    typeorm_test = "localhost",
}

enum Database {
    test = "rentx_test",
    typeorm = "rentx",
    typeorm_test = "rentx_test",
}

export const dataSource = new DataSource({
    type: "postgres",
    host: Host[process.env.NODE_ENV] ?? "database", // Nome dado ao service do banco de dados
    port: 5432,
    username: "docker",
    password: "ignite",
    database: Database[process.env.NODE_ENV] ?? "rentx",
    entities: ["./src/modules/**/entities/*.ts"],
    migrations: ["src/shared/infra/typeorm/migrations/*.ts"],
});

dataSource
    .initialize()
    .then(async () => {
        console.log("Initializing the database...");
    })
    .catch((err) => console.log(err));
