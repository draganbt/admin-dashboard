import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';

@ObjectType()
export class UsersPaginated {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
