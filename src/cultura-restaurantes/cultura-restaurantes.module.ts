import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaRestaurantesService } from './cultura-restaurantes.service';
import { CulturaRestaurantesController } from './cultura-restaurantes.controller';
import { JwtService } from '@nestjs/jwt';
import { CulturaRestaurantesResolver } from './cultura-restaurantes.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, RestauranteEntity]), CacheModule.register()],
  providers: [CulturaRestaurantesService, JwtService, CulturaRestaurantesResolver],
  controllers: [CulturaRestaurantesController],
})
export class CulturaRestaurantesModule {}
