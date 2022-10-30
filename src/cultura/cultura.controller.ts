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
import { CulturaService } from './cultura.service';
import { CulturaEntity } from './cultura.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaDto } from './cultura.dto';
import { plainToInstance } from 'class-transformer';
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaController {
  constructor(private readonly culturaService: CulturaService) {}

 
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  async findAll() {
    return await this.culturaService.findAll();
  }

  @Get(':culturaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  async findOne(@Param('culturaId') culturaId: string) {
    return await this.culturaService.findOne(culturaId);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  async create(@Body() culturaDto: CulturaDto) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.create(cultura);
  }

  @Put(':culturaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  async update(
    @Param('culturaId') culturaId: string,
    @Body() culturaDto: CulturaDto,
  ) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.update(culturaId, cultura);
  }

  @Delete(':culturaId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  async delete(@Param('culturaId') culturaId: string) {
    return await this.culturaService.delete(culturaId);
  }
}
