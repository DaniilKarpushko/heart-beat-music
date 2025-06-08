import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserType } from './user.type';
import { UserService } from '../user.service';
import { CreateUserInput } from './user.input';
import { PublicAccess } from 'supertokens-nestjs';

export interface User {
  id: string;
  nickname: string;
}

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserType)
  @PublicAccess()
  async createUser(@Args('data') data: CreateUserInput): Promise<UserType> {
    const created = await this.userService.create(data.nickname, data.id);
    return this.mapUserToGraphQL(created);
  }

  @Mutation(() => Boolean)
  @PublicAccess()
  async deleteUser(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<boolean> {
    await this.userService.delete(userId);
    return true;
  }

  private mapUserToGraphQL(user: User): UserType {
    return {
      id: user.id,
      nickname: user.nickname,
    };
  }
}
