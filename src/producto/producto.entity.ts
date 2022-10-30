import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class ProductoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  historia: string;

  @Field()
  @Column()
  categoria: string;

  @Field((type) => {
    return [CulturaEntity];
  })
  @ManyToMany(() => CulturaEntity, (cultura) => CulturaEntity.name)
  @JoinTable()
  cultura: CulturaEntity[];
}
