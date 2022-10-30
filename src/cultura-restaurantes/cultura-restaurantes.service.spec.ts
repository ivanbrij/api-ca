import { Test, TestingModule } from '@nestjs/testing';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { CulturaRestaurantesService } from './cultura-restaurantes.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('CulturaRestaurantesService', () => {
  let service: CulturaRestaurantesService;
  let culturaRepository: Repository<CulturaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let cultura: CulturaEntity;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaRestaurantesService],
    }).compile();

    service = module.get<CulturaRestaurantesService>(
      CulturaRestaurantesService,
    );
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    culturaRepository.clear();

    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.lorem.sentence(),
        estrellas: faker.datatype.number(),
        fecha: faker.date.birthdate(),
      });
      restaurantesList.push(restaurante);
    }

    cultura = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      restaurantes: restaurantesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestauranteCultura should add an restaurante to a cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });

    const result: CulturaEntity = await service.addRestauranteCultura(
      newCultura.id,
      newRestaurante.id,
    );

    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(result.restaurantes[0].ciudad).toBe(newRestaurante.ciudad);
    expect(result.restaurantes[0].estrellas).toBe(newRestaurante.estrellas);
  });

  it('addRestauranteCultura should thrown exception for an invalid restaurante', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addRestauranteCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('addRestauranteCultura should throw an exception for an invalid cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.addRestauranteCultura('0', newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('findRestauranteByCulturaIdRestauranteId should return restaurante by cultura', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    const storedRestaurante: RestauranteEntity =
      await service.findRestauranteByCulturaIdRestauranteId(
        cultura.id,
        restaurante.id,
      );
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
    expect(storedRestaurante.ciudad).toBe(restaurante.ciudad);
    expect(storedRestaurante.estrellas).toBe(restaurante.estrellas);
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(() =>
      service.findRestauranteByCulturaIdRestauranteId(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an invalid cultura', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(() =>
      service.findRestauranteByCulturaIdRestauranteId('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an restaurante not associated to the cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.findRestauranteByCulturaIdRestauranteId(
        cultura.id,
        newRestaurante.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no esta asociado a la cultura gastronomica',
    );
  });

  it('findRestaurantesByCulturaId should return restaurantes by cultura', async () => {
    const restaurantes: RestauranteEntity[] =
      await service.findRestaurantesByCulturaId(cultura.id);
    expect(restaurantes.length).toBe(5);
  });

  it('findRestaurantesByCulturaId should throw an exception for an invalid cultura', async () => {
    await expect(() =>
      service.findRestaurantesByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('associateRestaurantesCultura should update restaurantes list for a cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    const updatedCultura: CulturaEntity =
      await service.associateRestaurantesCultura(cultura.id, [newRestaurante]);
    expect(updatedCultura.restaurantes.length).toBe(1);
    expect(updatedCultura.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(updatedCultura.restaurantes[0].ciudad).toBe(newRestaurante.ciudad);
    expect(updatedCultura.restaurantes[0].estrellas).toBe(
      newRestaurante.estrellas,
    );
    expect(updatedCultura.restaurantes[0].fecha).toBe(newRestaurante.fecha);
  });

  it('associateRestaurantesCultura should throw an exception for an invalid cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.associateRestaurantesCultura('0', [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('associateRestaurantesCultura should throw an exception for an invalid restaurante', async () => {
    const newRestaurante: RestauranteEntity = restaurantesList[0];
    newRestaurante.id = '0';

    await expect(() =>
      service.associateRestaurantesCultura(cultura.id, [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('deleteRestauranteToCultura should remove an restaurante from a cultura', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];

    await service.deleteRestauranteCultura(cultura.id, restaurante.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: cultura.id },
      relations: ['restaurantes'],
    });
    const deletedRestaurante: RestauranteEntity =
      storedCultura.restaurantes.find((a) => a.id === restaurante.id);

    expect(deletedRestaurante).toBeUndefined();
  });

  it('deleteRestauranteToCultura should thrown an exception for an invalid restaurante', async () => {
    await expect(() =>
      service.deleteRestauranteCultura(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('deleteRestauranteToCultura should thrown an exception for an invalid cultura', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(() =>
      service.deleteRestauranteCultura('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura con el id dado no fue encontrada',
    );
  });

  it('deleteRestaurantesToCultura should thrown an exception for an non asocciated restaurante', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.deleteRestauranteCultura(cultura.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no esta asociado a la cultura gastronomica',
    );
  });
});
