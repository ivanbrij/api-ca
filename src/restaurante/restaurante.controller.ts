import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteService } from './restaurante.service';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { plainToInstance } from 'class-transformer';
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get()
  async findAll() {
    return await this.restauranteService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get(':restauranteId')
  async findOne(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.findOne(restauranteId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  @Post()
  async create(@Body() restauranteDto: RestauranteDto) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.create(restaurante);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  @Put(':restauranteId')
  async update(
    @Param('restauranteId') restauranteId: string,
    @Body() restauranteDto: RestauranteDto,
  ) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.update(restauranteId, restaurante);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  @Delete(':restauranteId')
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.delete(restauranteId);
  }
}
