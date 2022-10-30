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
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoService } from './producto.service';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Action } from '../user/Action ';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RolesGuard } from '../auth/guards/RolesGuard';

@Controller('producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class productoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.READ_PRODUCT)
  async get() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  async findOne(@Param('id') productoId: string) {
    console.log(productoId);
    return await this.productoService.findOne(productoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  async create(@Body() productoDto: ProductoDto) {
    const productoEntity: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(productoEntity);
  }

  @Put(':add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  async update(@Param('id') id: string, @Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(id, producto);
  }

  @Delete(':delete')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  async delete(@Param('id') id: string) {
    return await this.productoService.deleteProductAndCulture(id);
  }
}
