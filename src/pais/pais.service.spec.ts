import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisesList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),CacheModule.register()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save({
        nombre: faker.address.country(),
        descripcion: faker.lorem.sentence(),
      });
      paisesList.push(pais);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all paises', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisesList.length);
  });

  it('findOne should return a pais by id', async () => {
    const storedPais: PaisEntity = paisesList[0];
    const pais: PaisEntity = await service.findOne(storedPais.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre);
    expect(pais.descripcion).toEqual(storedPais.descripcion);
  });

  it('findOne should throw an exception for an invalid pais', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('create should return a new pais', async () => {
    const pais: PaisEntity = {
      id: '',
      nombre: faker.address.country(),
      descripcion: faker.lorem.sentence(),
      restaurantes: [],
      culturas: [],
    };

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({
      where: { id: newPais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre);
    expect(storedPais.descripcion).toEqual(newPais.descripcion);
  });

  it('update should modify a pais', async () => {
    const pais: PaisEntity = paisesList[0];
    pais.nombre = 'New name';
    pais.descripcion = 'New description';
    const updatedPais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedPais).not.toBeNull();
    const storedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.descripcion).toEqual(pais.descripcion);
  });

  it('update should throw an exception for an invalid pais', async () => {
    let pais: PaisEntity = paisesList[0];
    pais = {
      ...pais,
      nombre: 'New name',
      descripcion: 'New description',
    };
    await expect(() => service.update('0', pais)).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });

  it('delete should remove a pais', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    const deletedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(deletedPais).toBeNull();
  });

  it('delete should throw an exception for an invalid pais', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The pais with the given id was not found',
    );
  });
});

/*archivo src/pais/pais.service.spec.ts*/
