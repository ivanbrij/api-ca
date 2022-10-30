import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecetaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;
  
  @Field()
  @IsString()
  @IsNotEmpty()
  descripcion: string;
  
  @Field()
  @IsUrl()
  @IsNotEmpty()
  foto: string;
  
  @Field()
  @IsString()
  @IsNotEmpty()
  proceso: string;

  @Field()  
  @IsUrl()
  @IsNotEmpty()
  video: string;
}
