import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import { dataSource } from "..";

async function create() {
    const id = uuidV4();
    const password = await hash("admin", 8);

    await dataSource.initialize().then(async () => {
        await dataSource.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
            values('${id}', 'admin', 'admin@admin.com', '${password}', 'true', 'now()', 'XXXYYY')`
        );
    });

    await dataSource.destroy();
}

create().then(() => console.log("User admin created"));
