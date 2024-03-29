import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

interface IFile {
    filename: string;
}

export class UploadCarImagesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const images = request.files as IFile[];

        const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase);

        const fileNames = images?.map((image) => image.filename);

        await uploadCarImageUseCase.execute({
            car_id: id,
            images_name: fileNames,
        });

        return response.status(201).send();
    }
}
