import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaisDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
