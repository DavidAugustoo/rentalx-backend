import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { Car } from "./Car";

@Entity("cars_images")
class CarImage {
    @PrimaryColumn()
    id: string;

    @Column()
    car_id: string;

    @Column()
    image_name: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Car, (car) => car.images, { eager: true })
    @JoinColumn({ name: "car_id", referencedColumnName: "id" })
    car = Car;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}

export { CarImage };
