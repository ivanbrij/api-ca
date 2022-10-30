import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(type => [RestauranteEntity])
  @OneToMany(() => RestauranteEntity, (restaurante) => restaurante.pais)
  restaurantes: RestauranteEntity[];

  @ManyToMany(() => CulturaEntity, (cultura) => cultura.paises)
  culturas: CulturaEntity[];
}
