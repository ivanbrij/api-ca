import { Module, CacheModule} from '@nestjs/common';
import { CulturaRecetaService } from './cultura-receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaRecetaController } from './cultura-receta.controller';
import { JwtService } from '@nestjs/jwt';
import { CulturaRecetaResolver } from './cultura-receta.resolver';


@Module({
  providers: [CulturaRecetaService, JwtService, CulturaRecetaResolver],
  imports: [TypeOrmModule.forFeature([CulturaEntity, RecetaEntity]), CacheModule.register({
        path: ':memory:',
    options: {
      ttl: 5
    },
  })],
  controllers: [CulturaRecetaController],
})
export class CulturaRecetaModule {}
