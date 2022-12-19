import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
    car_id: string;
    images_name: string[];
}

@injectable()
class UploadCarImageUseCase {
    constructor(
        @inject("CarsImagesRepository")
        private carsImagesRepository: ICarsImagesRepository
    ) {}

    async execute({ car_id, images_name }: IRequest): Promise<void[]> {
        const car_image = await Promise.all(
            images_name.map(async (image) => {
                await this.carsImagesRepository.create(car_id, image);
            })
        );

        return car_image;
    }
}

export { UploadCarImageUseCase };
