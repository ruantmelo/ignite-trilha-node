import { parse as csvParse } from "csv-parse";
import fs from "fs";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IImportCategory {
    name: string;
    description: string;
}

export class ImportCategoryUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

    loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path);

            const categories: IImportCategory[] = [];
            const parseFile = csvParse();

            stream.pipe(parseFile);

            parseFile.on("data", async (row: any) => {
                const [name, description] = row;

                categories.push({ name, description });
            });

            parseFile.on("end", async () => {
                await fs.promises.unlink(file.path);
                resolve(categories);
            });

            parseFile.on("error", (err: Error) => {
                reject(err);
            });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file);

        categories.map((category) => {
            const { name, description } = category;

            const existsCategory = this.categoriesRepository.findByName(name);

            if (!existsCategory) {
                console.log(
                    this.categoriesRepository.create({ name, description })
                );
            }

            return true;
        });
    }
}