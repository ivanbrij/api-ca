import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { RecetaDto } from './receta.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('receta')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Post()
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }
  @Delete(':recetaId')
  @HttpCode(204)
  async delete(@Param('recetaId') recetaId: string) {
    return await this.recetaService.delete(recetaId);
  }
}
