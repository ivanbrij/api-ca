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
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get()
  async findAll() {
    return await this.paisService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get(':paisId')
  async findOne(@Param('paisId') paisId: string) {
    return await this.paisService.findOne(paisId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  @Post()
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  @Put(':paisId')
  async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisId, pais);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  @Delete(':paisId')
  @HttpCode(204)
  async delete(@Param('paisId') paisId: string) {
    return await this.paisService.delete(paisId);
  }
}
