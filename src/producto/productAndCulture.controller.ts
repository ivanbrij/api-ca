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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RolesGuard } from '../auth/guards/RolesGuard';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Action } from '../user/Action ';

@Controller('productoAndCulture')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductAndCultureController {
  constructor(private readonly productoService: ProductoService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Read)
  @Get(':getProductWithRelationShipToCulture')
  async findOne(@Param('name') name: string) {
    return await this.productoService.getProductWithRelationShipToCulture(name);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Create)
  async create(@Body() productoDto: ProductoDto) {
    const productoEntity: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.createProductAndCulture(productoEntity);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Update)
  async update(@Param('id') id: string, @Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.updateProductAndCulture(id, producto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roleName', Action.Delete)
  async delete(@Param('id') id: string) {
    return await this.productoService.deleteProductAndCulture(id);
  }
}
