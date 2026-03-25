import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UsersFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  role?: string;
}
