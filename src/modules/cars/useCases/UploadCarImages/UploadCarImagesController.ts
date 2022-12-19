import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImageUseCase } from "./UploadCarImagesUseCase";

class UploadCarImagesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const images = request.files as Express.Multer.File[];

        const uploadCarImageUseCase = container.resolve(UploadCarImageUseCase);

        const images_name = images.map(
            (image: Express.Multer.File) => image.filename
        );

        await uploadCarImageUseCase.execute({
            car_id: id,
            images_name,
        });

        return response.status(201).send();
    }
}

export { UploadCarImagesController };
