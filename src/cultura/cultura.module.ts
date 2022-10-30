import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaService } from './cultura.service';
import { CulturaEntity } from './cultura.entity';
import { CulturaController } from './cultura.controller';
import { JwtService } from '@nestjs/jwt';
import { CulturaResolver } from './cultura.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity]), CacheModule.register({
    path: ':memory:',
    options: {
      ttl: 5
    },
  
  })
  ],
  providers: [CulturaService, JwtService, CulturaResolver],
  controllers: [CulturaController],
})
export class CulturaModule {}
