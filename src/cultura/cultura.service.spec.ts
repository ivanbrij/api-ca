import { Test, TestingModule } from '@nestjs/testing';
import { CulturaService } from './cultura.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaEntity } from './cultura.entity';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('CulturaService', () => {
  let service: CulturaService;
  let repository: Repository<CulturaEntity>;
  let culturaList: CulturaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaService],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    repository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    culturaList = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
      culturaList.push(cultura);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all cultures', async () => {
    const cultura: CulturaEntity[] = await service.findAll();
    expect(cultura).not.toBeNull();
    expect(cultura).toHaveLength(culturaList.length);
  });

  it('findOne should return a culture by id', async () => {
    const storedCultura: CulturaEntity = culturaList[0];
    const cultura: CulturaEntity = await service.findOne(storedCultura.id);
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(storedCultura.nombre);
    expect(cultura.descripcion).toEqual(storedCultura.descripcion);
  });

  it('findOne should throw an exception for an invalid culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('create should return a new culture', async () => {
    const cd = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      restaurantes: [],
      paises: [],
      productos: [],
    };

    const newCultura: CulturaEntity = await service.create(cd);
    expect(newCultura).not.toBeNull();

    const storedCultura: CulturaEntity = await repository.findOne({
      where: { id: newCultura.id },
    });
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(newCultura.nombre);
    expect(storedCultura.descripcion).toEqual(newCultura.descripcion);
  });

  it('update should modify a culture', async () => {
    const cultura: CulturaEntity = culturaList[0];
    cultura.nombre = 'New name';
    cultura.descripcion = 'New description';
    const updatedCulture: CulturaEntity = await service.update(
      cultura.id,
      cultura,
    );
    expect(updatedCulture).not.toBeNull();
    const storedCultura: CulturaEntity = await repository.findOne({
      where: { id: cultura.id },
    });
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(cultura.nombre);
    expect(storedCultura.descripcion).toEqual(cultura.descripcion);
  });

  it('update should throw an exception for an invalid culture', async () => {
    let cultura: CulturaEntity = culturaList[0];
    cultura = {
      ...cultura,
      nombre: 'New name',
      descripcion: 'New description',
    };
    await expect(() => service.update('0', cultura)).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('delete should remove a culture', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.delete(cultura.id);
    const deletedCulture: CulturaEntity = await repository.findOne({
      where: { id: cultura.id },
    });
    expect(deletedCulture).toBeNull();
  });

  it('delete should throw an exception for an invalid culture', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.delete(cultura.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });
});
