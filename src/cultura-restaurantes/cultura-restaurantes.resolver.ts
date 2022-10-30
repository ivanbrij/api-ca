import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteService } from '../restaurante/restaurante.service';
import { CulturaRestaurantesService } from './cultura-restaurantes.service';

@Resolver()
export class CulturaRestaurantesResolver {
    constructor(private cultura_restauranteService: CulturaRestaurantesService) {}

    @Query(() => [RestauranteEntity])
    restaurantesDeCultura(@Args('culturaId') culturaId: string): Promise<RestauranteEntity[]> {
        return this.cultura_restauranteService.findRestaurantesByCulturaId(culturaId);
    }
 
    @Query(() => RestauranteEntity)
    restauranteDeCultura(@Args('culturaId') culturaId: string, @Args('restauranteId') restauranteId: string): Promise<RestauranteEntity> {
        return this.cultura_restauranteService.findRestauranteByCulturaIdRestauranteId(culturaId, restauranteId);
    }

    @Mutation(() => CulturaEntity)
    agregarRestauranteACultura(@Args('culturaId') culturaId: string, @Args('restauranteId') restauranteId: string): Promise<CulturaEntity> {
        return this.cultura_restauranteService.addRestauranteCultura(culturaId, restauranteId);
    }

    @Mutation(() => String)
    borrarRestauranteDeCultura(@Args('culturaId') culturaId: string, @Args('restauranteId') restauranteId: string) {
        this.cultura_restauranteService.deleteRestauranteCultura(culturaId, restauranteId);
        return restauranteId;
    }

    /*
    @Mutation(() => CulturaEntity)
    asociarRestaurantesACultura(@Args('culturaid') culturaId: string, @Args('restaurantes') restaurantes: RestauranteEntity[]): Promise<CulturaEntity> {
        return this.cultura_restauranteService.associateRestaurantesCultura(culturaId, restaurantes);
    }*/
}
