import { Specification } from "../infra/typeorm/entities/Specification";

export interface ICreateSpecificationDTO {
    name: string;
    description: string;
}

export interface ISpecificationsRepository {
    findByName(name: string): Promise<Specification | undefined>;
    list(): Promise<Specification[]>;
    create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification>;
    findByIds(ids: string[]): Promise<Specification[]>;
}
