import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from 'src/restaurante/restaurante.dto';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRestaurantesService } from './cultura-restaurantes.service';
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('culturas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRestaurantesController {
    constructor(private readonly culturaRestauranteService: CulturaRestaurantesService){}
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roleName', Action.Create)
    @Post(':culturaId/restaurantes/:restauranteId')
    async addRestauranteCultura(@Param('culturaID') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.culturaRestauranteService.addRestauranteCultura(culturaId, restauranteId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roleName', Action.Read)
    @Get(':culturaId/restaurantes/:restauranteId')
    async findRestauranteByCulturaIdRestauranteId(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(culturaId, restauranteId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roleName', Action.Read)
    @Get(':culturaId/restaurantes')
    async findRestaurantesByCulturaId(@Param('culturaId') culturaId: string){
       return await this.culturaRestauranteService.findRestaurantesByCulturaId(culturaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roleName', Action.Update)
    @Put(':culturaId/restaurantes')
    async associateRestaurantesCultura(@Body() restaurantesDto: RestauranteDto[], @Param('culturaId') culturaId: string){
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
       return await this.culturaRestauranteService.associateRestaurantesCultura(culturaId, restaurantes);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roleName', Action.Delete)
    @Delete(':culturaId/restaurantes/:restauranteId')
    @HttpCode(204)
    async deleteRestauranteCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.culturaRestauranteService.deleteRestauranteCultura(culturaId, restauranteId);
    }

}
