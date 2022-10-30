import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { faker } from '@faker-js/faker';
import { PaisEntity } from '../pais/pais.entity';
import { CacheModule } from '@nestjs/common';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let paisRepository: Repository<PaisEntity>;
  let restaurantesList: RestauranteEntity[];
  let paisesList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];
    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.lorem.sentence(),
        estrellas: faker.datatype.number(),
        fecha: faker.date.birthdate(),
      });
      restaurantesList.push(restaurante);
    }
    const pais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
    paisesList.push(pais);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurante: RestauranteEntity[] = await service.findAll();
    expect(restaurante).not.toBeNull();
    expect(restaurante).toHaveLength(restaurantesList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurante: RestauranteEntity = restaurantesList[0];
    const restaurante: RestauranteEntity = await service.findOne(
      storedRestaurante.id,
    );
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre);
    expect(restaurante.ciudad).toEqual(storedRestaurante.ciudad);
    expect(restaurante.estrellas).toEqual(storedRestaurante.estrellas);
    expect(restaurante.fecha).toEqual(storedRestaurante.fecha);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('create should return a new restaurant', async () => {
    const storedPais: PaisEntity = paisesList[0];

    const cd = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellas: faker.datatype.number(),
      fecha: faker.date.birthdate(),
      pais: storedPais,
      culturas: [],
    };

    const newRestaurante: RestauranteEntity = await service.create(cd);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: newRestaurante.id },
    });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre);
    expect(storedRestaurante.ciudad).toEqual(newRestaurante.ciudad);
    expect(storedRestaurante.estrellas).toEqual(newRestaurante.estrellas);
    expect(storedRestaurante.fecha).toEqual(newRestaurante.fecha);
  });

  it('update should modify a restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = 'New name';
    restaurante.ciudad = 'New city';
    const updatedRestaurante: RestauranteEntity = await service.update(
      restaurante.id,
      restaurante,
    );
    expect(updatedRestaurante).not.toBeNull();
    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante.ciudad).toEqual(restaurante.ciudad);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante,
      nombre: 'New name',
      ciudad: 'New city',
    };
    await expect(() => service.update('0', restaurante)).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    const deletedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });
});

function seedDatabase() {
  throw new Error('Function not implemented.');
}
