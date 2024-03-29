import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dto/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { UserTokens } from "../entities/UserTokens";

export class UsersTokensRepository implements IUsersTokensRepository {
    private repository: Repository<UserTokens>;

    constructor() {
        this.repository = getRepository(UserTokens);
    }
    async create(data: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = this.repository.create(data);

        await this.repository.save(userToken);

        return userToken;
    }

    async findByRefreshToken(
        refresh_token: string
    ): Promise<UserTokens | undefined> {
        const userToken = await this.repository.findOne({
            where: { refresh_token },
        });

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens | undefined> {
        const userToken = await this.repository.findOne({
            where: { user_id, refresh_token },
        });

        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
