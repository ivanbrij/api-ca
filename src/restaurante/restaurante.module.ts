import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { JwtService } from '@nestjs/jwt';
import { RestauranteResolver } from './restaurante.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity]), CacheModule.register()],
  providers: [RestauranteService, JwtService, RestauranteResolver],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
