import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CulturaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
