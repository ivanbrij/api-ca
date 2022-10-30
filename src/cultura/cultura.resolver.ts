import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CulturaService } from './cultura.service';
import { CulturaEntity } from './cultura.entity';
import { plainToInstance } from 'class-transformer';
import { CulturaDto } from './cultura.dto';



@Resolver()
export class CulturaResolver {
    constructor(private culturaService: CulturaService) {}

    @Query(() => [CulturaEntity])
    culturas(): Promise<CulturaEntity[]> {
        return this.culturaService.findAll();
    }

    @Query(() => CulturaEntity)
    cultura(@Args('id') id: string): Promise<CulturaEntity> {
        return this.culturaService.findOne(id);
    }

    @Mutation(() => CulturaEntity)
    createCultura(@Args('cultura') culturaDto: CulturaDto): Promise<CulturaEntity> {
        const cultura = plainToInstance(CulturaEntity, culturaDto);
        return this.culturaService.create(cultura);
    }
 
    @Mutation(() => CulturaEntity)
    updateCultura(@Args('id') id: string, @Args('cultura') culturaDto: CulturaDto): Promise<CulturaEntity> {
        const cultura = plainToInstance(CulturaEntity, culturaDto);
        return this.culturaService.update(id, cultura);
    }
 
    @Mutation(() => String)
    deleteCultura(@Args('id') id: string) {
        this.culturaService.delete(id);
        return id;
    }
}
