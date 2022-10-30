import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { RecetaController } from './receta.controller';
import { RecetaResolver } from './receta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  providers: [RecetaService, RecetaResolver],
  controllers: [RecetaController],
})
export class RecetaModule {}
