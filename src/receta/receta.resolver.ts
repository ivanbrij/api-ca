import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RecetaDto } from './receta.dto';


@Resolver()
export class RecetaResolver {
    constructor(private recetaService: RecetaService) {}

    @Query(() => [RecetaEntity])
    recetas(): Promise<RecetaEntity[]> {
        return this.recetaService.findAll();
    }
 
    @Query(() => RecetaEntity)
    receta(@Args('id') id: string): Promise<RecetaEntity> {
        return this.recetaService.findOne(id);
    }

    @Mutation(() => RecetaEntity)
    createReceta(@Args('receta') recetaDto: RecetaDto): Promise<RecetaEntity> {
        const receta = plainToInstance(RecetaEntity, recetaDto);
        return this.recetaService.create(receta);
    }
 
    @Mutation(() => String)
    deleteReceta(@Args('id') id: string) {
        this.recetaService.delete(id);
        return id;
    }
}
