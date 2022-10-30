import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisRestauranteService } from './pais-restaurante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('PaisRestauranteService', () => {
  let service: PaisRestauranteService;
  let paisRepository: Repository<PaisEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let pais: PaisEntity;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [PaisRestauranteService],
    }).compile();

    service = module.get<PaisRestauranteService>(PaisRestauranteService);
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    paisRepository.clear();

    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city(),
        estrellas: faker.datatype.number(),
        fecha: faker.date.birthdate(),
      });
      restaurantesList.push(restaurante);
    }

    pais = await paisRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.sentence(),
      restaurantes: restaurantesList,
      culturas: [],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantePais should add a restaurante to a pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.sentence(),
      restaurantes: [],
      culturas: [],
    });

    const result: PaisEntity = await service.addRestaurantePais(
      newPais.id,
      newRestaurante.id,
    );

    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(result.restaurantes[0].ciudad).toBe(newRestaurante.ciudad);
    expect(result.restaurantes[0].estrellas).toBe(newRestaurante.estrellas);
    expect(result.restaurantes[0].fecha).toStrictEqual(newRestaurante.fecha);
  });

  it('addRestaurantePais should thrown exception for an invalid restaurante', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.sentence(),
      restaurantes: [],
      culturas: [],
    });

    await expect(() =>
      service.addRestaurantePais(newPais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurante with the given id was not found',
    );
  });

  it('addRestaurantePais should throw an exception for an invalid pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.addRestaurantePais('0', newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('findRestauranteByPaisIdRestauranteId should return restaurante by pais', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    const storedRestaurante: RestauranteEntity =
      await service.findRestauranteByPaisIdRestauranteId(
        pais.id,
        restaurante.id,
      );
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
    expect(storedRestaurante.ciudad).toBe(restaurante.ciudad);
    expect(storedRestaurante.estrellas).toBe(restaurante.estrellas);
    expect(storedRestaurante.fecha).toStrictEqual(restaurante.fecha);
  });

  it('findRestauranteByPaisIdRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurante with the given id was not found',
    );
  });

  it('findRestauranteByPaisIdRestauranteId should throw an exception for an invalid pais', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('findRestauranteByPaisIdRestauranteId should throw an exception for an restaurante not associated to the pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId(pais.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The restaurante with the given id is not associated to the pais',
    );
  });

  it('findRestaurantesByPaisId should return restaurantes by pais', async () => {
    const restaurantes: RestauranteEntity[] =
      await service.findRestaurantesByPaisId(pais.id);
    expect(restaurantes.length).toBe(5);
  });

  it('findRestaurantesByPaisId should throw an exception for an invalid pais', async () => {
    await expect(() =>
      service.findRestaurantesByPaisId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('associateRestaurantesPais should update restaurantes list for a pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    const updatedPais: PaisEntity = await service.associateRestaurantesPais(
      pais.id,
      [newRestaurante],
    );
    expect(updatedPais.restaurantes.length).toBe(1);

    expect(updatedPais.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(updatedPais.restaurantes[0].ciudad).toBe(newRestaurante.ciudad);
    expect(updatedPais.restaurantes[0].estrellas).toBe(
      newRestaurante.estrellas,
    );
    expect(updatedPais.restaurantes[0].fecha).toBe(newRestaurante.fecha);
  });

  it('associateRestaurantesPais should throw an exception for an invalid pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.associateRestaurantesPais('0', [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('associateRestaurantesPais should throw an exception for an invalid restaurante', async () => {
    const newRestaurante: RestauranteEntity = restaurantesList[0];
    newRestaurante.id = '0';

    await expect(() =>
      service.associateRestaurantesPais(pais.id, [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'The restaurante with the given id was not found',
    );
  });

  it('deleteRestauranteToPais should remove an restaurante from a pais', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];

    await service.deleteRestaurantePais(pais.id, restaurante.id);

    const storedPais: PaisEntity = await paisRepository.findOne({
      where: { id: pais.id },
      relations: ['restaurantes'],
    });
    const deletedRestaurante: RestauranteEntity = storedPais.restaurantes.find(
      (a) => a.id === restaurante.id,
    );

    expect(deletedRestaurante).toBeUndefined();
  });

  it('deleteRestauranteToPais should thrown an exception for an invalid restaurante', async () => {
    await expect(() =>
      service.deleteRestaurantePais(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurante with the given id was not found',
    );
  });

  it('deleteRestauranteToPais should thrown an exception for an invalid pais', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(() =>
      service.deleteRestaurantePais('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('deleteRestauranteToPais should thrown an exception for an non asocciated restaurante', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
    });

    await expect(() =>
      service.deleteRestaurantePais(pais.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The restaurante with the given id is not associated to the pais',
    );
  });
});
