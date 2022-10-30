import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  ciudad: string;

  @Field()
  @Column()
  estrellas: number;

  @Field()
  @Column()
  fecha: Date;

  @Field(type => PaisEntity)
  @ManyToOne(() => PaisEntity, (pais) => pais.restaurantes)
  pais: PaisEntity;

  @Field(type => [CulturaEntity])
  @ManyToMany(() => CulturaEntity, (cultura) => cultura.restaurantes)
  culturas: CulturaEntity[];
}
