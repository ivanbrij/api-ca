import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CulturaRecetaService } from './cultura-receta.service';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaDto } from '../receta/receta.dto';
import { plainToInstance } from 'class-transformer';



@Resolver()
export class CulturaRecetaResolver {
    constructor(private culturaRecetaService: CulturaRecetaService) {}

    @Query(() => [RecetaEntity])
    recetasCultura(@Args('cultura_id')cultura_id: string): Promise<RecetaEntity[]> {
        return this.culturaRecetaService.findRecetasByCulturaId(cultura_id);
    }

    @Query(() => RecetaEntity)
    recetaCultura(
        @Args( 'cultura_id') cultura_id: string,
        @Args( 'receta_id') receta_id: string): Promise<RecetaEntity> {
        return this.culturaRecetaService.findRecetaByCulturaIdRecetaId(cultura_id, receta_id);
    }
    @Mutation(() => CulturaEntity)
    addRecetaToCultura(@Args( 'cultura_id') cultura_id: string,
                       @Args( 'receta_id') receta_id: string): Promise<CulturaEntity>{
        return this.culturaRecetaService.addRecetaCultura(cultura_id, receta_id);
    }
     /*
    @Mutation(() => CulturaEntity)
    asociateRecetasCultura(@Args( 'cultura_id') cultura_id: string,
                            @Args({name:'recetas', type:()=>[RecetaDto]}) receta: RecetaDto[]): Promise<CulturaEntity> {
        const recetas = plainToInstance(RecetaEntity, receta);
        return this.culturaRecetaService.associateRecetasCultura(cultura_id, recetas);
    }*/
 
    @Mutation(() => String)
    deleteRecetaFromCultura(@Args( 'cultura_id') cultura_id: string,
                            @Args( 'receta_id') receta_id: string) {
        this.culturaRecetaService.deleteRecetaCultura(cultura_id, receta_id);
        return cultura_id;
    }
}
