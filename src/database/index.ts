import { DataSource } from "typeorm";

const dataSource = new DataSource({
    type: "postgres",
    host: "database", // Nome dado ao service do banco de dados
    port: 5432,
    username: "docker",
    password: "ignite",
    database: "rentx",
});

dataSource
    .initialize()
    .then(async () => {
        console.log("Initializing the database...");
    })
    .catch((err) => console.log(err));
