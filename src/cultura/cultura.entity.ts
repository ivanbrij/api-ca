import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;
  
  @Field(type=>[RecetaEntity])
  @OneToMany(() => RecetaEntity, (receta) => receta.cultura)
  recetas: RecetaEntity[];

  @Field(type => [RestauranteEntity])
  @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.culturas)
  @JoinTable()
  restaurantes: RestauranteEntity[];

  @ManyToMany(() => PaisEntity, (pais) => pais.culturas)
  @JoinTable()
  paises: PaisEntity[];

  @ManyToMany(() => ProductoEntity, (producto) => producto.cultura)
  @JoinTable()
  productos: ProductoEntity[];
}
