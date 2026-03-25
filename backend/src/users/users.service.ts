import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersFilterInput } from './dto/pagination/users-filter.input';
import { PaginationInput } from './dto/pagination/pagination.input';
import { UsersPaginated } from './dto/pagination/users-paginated.output';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  // -----------------------------
  // Create user with hashed password
  // -----------------------------
  async create(input: Omit<User, 'id'> & { password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = this.repo.create({
      ...input,
      password: hashedPassword,
    });
    return this.repo.save(user);
  }

  // -----------------------------
  // Find all users with optional search/filter and pagination
  // -----------------------------
  async findAll(
    filter?: UsersFilterInput,
    pagination?: PaginationInput,
  ): Promise<UsersPaginated> {
    const query = this.repo.createQueryBuilder('user');

    // Filter by email (search)
    if (filter?.search) {
      query.andWhere('user.email ILIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    // Filter by role
    if (filter?.role) {
      query.andWhere('user.role = :role', { role: filter.role });
    }

    // Pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    query.skip((page - 1) * limit).take(limit);

    // Get users and total count
    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // -----------------------------
  // Find one user by ID
  // -----------------------------
  findOne(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  // -----------------------------
  // Find user by email
  // -----------------------------
  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  // -----------------------------
  // Update user (excluding password)
  // -----------------------------
  async update(
    id: string,
    input: Partial<Omit<User, 'id' | 'password'>>,
  ): Promise<User | null> {
    await this.repo.update(id, input);
    return this.findOne(id);
  }

  // -----------------------------
  // Delete user
  // -----------------------------
  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
