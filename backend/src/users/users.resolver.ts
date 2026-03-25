import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './roles.enum';
import { UsersFilterInput } from './dto/pagination/users-filter.input';
import { PaginationInput } from './dto/pagination/pagination.input';
import { UsersPaginated } from './dto/pagination/users-paginated.output';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Query(() => UsersPaginated, { name: 'users' })
  async getUsers(
    @Args('filter', { nullable: true }) filter?: UsersFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<UsersPaginated> {
    return this.usersService.findAll(filter, pagination);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Query(() => User, { name: 'user', nullable: true })
  async getUser(@Args('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  // -----------------------------
  // ADMIN MUTATIONS
  // -----------------------------
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.create(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User | null> {
    return this.usersService.update(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.usersService.remove(id);
  }

  // -----------------------------
  // PUBLIC MUTATION FOR REGISTER
  // -----------------------------
  @Mutation(() => User)
  async registerUser(@Args('input') input: CreateUserInput): Promise<User> {
    // Ensure default role USER
    if (!input.role) input.role = Role.USER;
    return this.usersService.create(input);
  }
}
