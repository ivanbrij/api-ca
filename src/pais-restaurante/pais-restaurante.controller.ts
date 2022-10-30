import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisRestauranteService } from './pais-restaurante.service';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { plainToInstance } from 'class-transformer';
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisRestauranteController {
  constructor(
    private readonly paisRestauranteService: PaisRestauranteService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  @Post(':paisId/restaurantes/:restauranteId')
  async addRestaurantePais(
    @Param('paisId') paisId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.paisRestauranteService.addRestaurantePais(
      paisId,
      restauranteId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get(':paisId/restaurantes/:restauranteId')
  async findRestauranteByPaisIdRestauranteId(
    @Param('paisId') paisId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.paisRestauranteService.findRestauranteByPaisIdRestauranteId(
      paisId,
      restauranteId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get(':paisId/restaurantes')
  async findRestaurantesByPaisId(@Param('paisId') paisId: string) {
    return await this.paisRestauranteService.findRestaurantesByPaisId(paisId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  @Put(':paisId/restaurantes')
  async associateRestaurantesPais(
    @Body() restaurantesDto: RestauranteDto[],
    @Param('paisId') paisId: string,
  ) {
    const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
    return await this.paisRestauranteService.associateRestaurantesPais(
      paisId,
      restaurantes,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  @Delete(':paisId/restaurantes/:restauranteId')
  @HttpCode(204)
  async deleteRestaurantePais(
    @Param('paisId') paisId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.paisRestauranteService.deleteRestaurantePais(
      paisId,
      restauranteId,
    );
  }
}
