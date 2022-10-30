import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
  SetMetadata
} from '@nestjs/common';
import { CulturaRecetaService } from './cultura-receta.service';
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from '../receta/receta.entity';
import { RecetaDto } from '../receta/receta.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRecetaController {
  constructor(private readonly culturaRecetaService: CulturaRecetaService) {}

  @Post(':culturaId/receta/:recetaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  async addRecetaCultura(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.addRecetaCultura(
      culturaId,
      recetaId,
    );
  }
  @Get(':culturaId/receta/:recetaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  async findRecetaByCulturaIdRecetaId(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.findRecetaByCulturaIdRecetaId(
      culturaId,
      recetaId,
    );
  }

  @Get(':culturaId/receta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  async findRecetasByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaRecetaService.findRecetasByCulturaId(culturaId);
  }
  @Put(':culturaId/receta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  async associateRecetasCultura(
    @Body() recetasDto: RecetaDto[],
    @Param('culturaId') culturaId: string,
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.culturaRecetaService.associateRecetasCultura(
      culturaId,
      recetas,
    );
  }

  @Delete(':culturaId/receta/:recetaId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  async deleteRecetaCultura(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.deleteRecetaCultura(
      culturaId,
      recetaId,
    );
  }
}
