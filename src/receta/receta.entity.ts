import { CulturaEntity } from '../cultura/cultura.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
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
  foto: string;
  @Field()
  @Column()
  proceso: string;
  @Field()
  @Column()
  video: string;

  @Field(type =>CulturaEntity)
  @ManyToOne(() => CulturaEntity, (cultura) => cultura.recetas)
  cultura?: CulturaEntity;
}
