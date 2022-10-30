import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { PaisRestauranteService } from './pais-restaurante.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';


@Resolver()
export class PaisRestauranteResolver {
    constructor(private paisRestauranteService: PaisRestauranteService) {}

    @Query(() => [RestauranteEntity])
    restaurantesPais(@Args('pais_id')pais_id: string): Promise<RestauranteEntity[]> {
        return this.paisRestauranteService.findRestaurantesByPaisId(pais_id);
    }

    @Query(() => RestauranteEntity)
    restaurantePais(
        @Args( 'pais_id') pais_id: string,
        @Args( 'restaurante_id') restaurante_id: string): Promise<RestauranteEntity> {
        return this.paisRestauranteService.findRestauranteByPaisIdRestauranteId(pais_id, restaurante_id);
    }
    @Mutation(() => PaisEntity)
    addRestauranteToPais(@Args( 'pais_id') pais_id: string,
                       @Args( 'restaurante_id') restaurante_id: string): Promise<PaisEntity>{
        return this.paisRestauranteService.addRestaurantePais(pais_id, restaurante_id);
    }

    @Mutation(() => String)
    deleteRestauranteFromPais(@Args( 'pais_id') pais_id: string,
                            @Args( 'restaurante_id') restaurante_id: string) {
        this.paisRestauranteService.deleteRestaurantePais(pais_id, restaurante_id);
        return pais_id;
    }
}