import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppErrors";

interface IRequest {
    user_id: string;
    avatarFile: string;
}

@injectable()
export class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository,
        @inject("StorageProvider") private storageProvider: IStorageProvider
    ) {}

    async execute({ user_id, avatarFile }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        await this.storageProvider.save(avatarFile, "avatar");

        if (user.avatar) {
            await this.storageProvider.delete(user.avatar, "avatar");
        }

        user.avatar = avatarFile;

        await this.usersRepository.create(user);
    }
}
