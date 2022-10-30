import { Module, CacheModule } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisController } from './pais.controller';
import { JwtService } from '@nestjs/jwt';
import { PaisResolver } from './pais.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity]), CacheModule.register()],
  providers: [PaisService, JwtService, PaisResolver],
  controllers: [PaisController],
})
export class PaisModule {}
