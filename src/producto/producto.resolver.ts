import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { ProductoDto } from './producto.dto';

@Resolver()
export class ProductoResolver {
  constructor(private productoService: ProductoService) {}

  @Query(() => [ProductoEntity])
  producto(): Promise<ProductoEntity[]> {
    return this.productoService.findAll();
  }

  @Query(() => ProductoEntity)
  productByiD(@Args('id') id: string): Promise<ProductoEntity> {
    return this.productoService.findOne(id);
  }
  @Mutation(() => ProductoEntity)
  createProduct(
    @Args('product') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const pais = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.create(pais);
  }

  @Mutation(() => ProductoEntity)
  updateProduct(
    @Args('id') id: string,
    @Args('product') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const product = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.update(id, product);
  }

  @Mutation(() => String)
  deleteProduct(@Args('id') id: string) {
    this.productoService.deleteProductAndCulture(id);
    return id;
  }
}
