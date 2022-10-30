import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../../cultura/cultura.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { PaisEntity } from '../../pais/pais.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CulturaEntity,
      RecetaEntity,
      ProductoEntity,
      RestauranteEntity,
      PaisEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CulturaEntity,
    RecetaEntity,
    ProductoEntity,
    RestauranteEntity,
    PaisEntity,
  ]),
];
