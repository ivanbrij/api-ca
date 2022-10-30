import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { ProductoEntity } from './producto.entity';
import { CulturaEntity } from '../cultura/cultura.entity';

@Injectable()
export class ProductoService {
  cacheProductoKey = 'producto';
  cacheProductRestaurantKey = 'producto_restaurante';
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoEntityRepository: Repository<ProductoEntity>,
    @InjectRepository(CulturaEntity)
    private readonly cultureEntityRepository: Repository<CulturaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    const cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheProductoKey);

    if (!cached) {
      const restaurantes: ProductoEntity[] =
        await this.productoEntityRepository.find({ relations: ['cultura'] });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.cacheManager.set(this.cacheProductoKey, restaurantes);
      return restaurantes;
    }
    return cached;
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const product: ProductoEntity = await this.productoEntityRepository.findOne(
      {
        where: { id },
      },
    );
    if (!product)
      throw new BusinessLogicException(
        'El producto  con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    return product;
  }

  async create(productoEntity: ProductoEntity): Promise<ProductoEntity> {
    return await this.productoEntityRepository.save(productoEntity);
  }

  async update(
    id: string,
    productoEntity: ProductoEntity,
  ): Promise<ProductoEntity> {
    const persistedCultura: ProductoEntity =
      await this.productoEntityRepository.findOne({ where: { id } });
    if (!persistedCultura)
      throw new BusinessLogicException(
        'El producto no se encontro',
        BusinessError.NOT_FOUND,
      );

    productoEntity.id = id;

    return await this.productoEntityRepository.save(productoEntity);
  }

  async getProductWithRelationShipToCulture(name: string) {
    const cultura = await this.cultureEntityRepository.find();
    return cultura.filter((word) => word.nombre.includes(name));
  }

  async createProductAndCulture(productoEntity: ProductoEntity) {
    const product: ProductoEntity = await this.productoEntityRepository.findOne(
      {
        where: { id: productoEntity.id },
      },
    );
    if (!product)
      throw new BusinessLogicException(
        'El producto con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    let cultura: CulturaEntity = await this.cultureEntityRepository.findOne({
      where: { id: productoEntity.id },
      relations: ['productos'],
    });
    if (!cultura) {
      const cul = new CulturaEntity();
      cul.id = productoEntity.id;
      cul.nombre = productoEntity.nombre;
      cul.descripcion = productoEntity.descripcion;
      cul.recetas = [];
      cul.restaurantes = [];
      cul.paises = [];
      cul.productos = [productoEntity];
      await this.cultureEntityRepository.save(cul);
    }

    cultura = await this.cultureEntityRepository.findOne({
      where: { id: productoEntity.id },
      relations: ['productos'],
    });

    cultura.productos = [...cultura.productos, product];
    return await this.cultureEntityRepository.save(cultura);
  }

  async updateProductAndCulture(id: string, productoEntity: ProductoEntity) {
    const persistedCultura: CulturaEntity =
      await this.cultureEntityRepository.findOne({ where: { id } });

    if (!persistedCultura)
      throw new BusinessLogicException(
        'La cultura  con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    persistedCultura.id = id;
    persistedCultura.nombre = productoEntity.nombre;
    persistedCultura.descripcion = productoEntity.descripcion;
    persistedCultura.productos = [productoEntity];
    await this.cultureEntityRepository.save(persistedCultura);

    const productCultura: ProductoEntity =
      await this.productoEntityRepository.findOne({ where: { id } });

    if (!productCultura)
      throw new BusinessLogicException(
        'El producto  con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );
    productCultura.id = id;
    productCultura.nombre = productoEntity.nombre;
    productCultura.descripcion = productoEntity.descripcion;
    productCultura.historia = productoEntity.historia;
    productCultura.categoria = productCultura.historia;
    return await this.productoEntityRepository.save(productCultura);
  }

  async deleteProductAndCulture(id: string) {
    const cultura: CulturaEntity = await this.cultureEntityRepository.findOne({
      where: { id },
    });
    if (!cultura)
      throw new BusinessLogicException(
        'El producto con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    await this.cultureEntityRepository.remove(cultura);

    const product: ProductoEntity = await this.productoEntityRepository.findOne(
      {
        where: { id },
      },
    );
    if (!product)
      throw new BusinessLogicException(
        'El producto no se encontro para eliminarse',
        BusinessError.NOT_FOUND,
      );

    await this.productoEntityRepository.remove(product);
  }
}
