import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CulturaRecetaService } from './cultura-receta.service';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import { CacheModule } from '@nestjs/common';

describe('CulturaRecetaService', () => {
  let service: CulturaRecetaService;
  let culturaRepository: Repository<CulturaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let cultura: CulturaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),CacheModule.register()],
      providers: [CulturaRecetaService],
    }).compile();

    service = module.get<CulturaRecetaService>(CulturaRecetaService);
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaRepository.clear();

    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.cats(),
        proceso: faker.lorem.sentence(),
        video: faker.image.imageUrl(),
      });
      recetasList.push(receta);
    }

    cultura = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: recetasList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaCultura should add an receta to a cultura', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.imageUrl(),
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });

    const result: CulturaEntity = await service.addRecetaCultura(
      newCultura.id,
      newReceta.id,
    );

    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0]).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(newReceta.nombre);
    expect(result.recetas[0].descripcion).toBe(newReceta.descripcion);
    expect(result.recetas[0].foto).toBe(newReceta.foto);
    expect(result.recetas[0].proceso).toBe(newReceta.proceso);
    expect(result.recetas[0].video).toBe(newReceta.video);
  });

  it('addRecetaCultura should thrown exception for an invalid receta', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addRecetaCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty('message', 'La receta con id dado no se encontró');
  });

  it('addRecetaCultura should throw an exception for an invalid cultura', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addRecetaCultura('0', newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('findRecetaByCulturaIdRecetaId should return receta by cultura', async () => {
    const receta: RecetaEntity = recetasList[0];
    const storedReceta: RecetaEntity =
      await service.findRecetaByCulturaIdRecetaId(cultura.id, receta.id);
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toBe(receta.nombre);
    expect(storedReceta.descripcion).toBe(receta.descripcion);
    expect(storedReceta.foto).toBe(receta.foto);
    expect(storedReceta.proceso).toBe(receta.proceso);
    expect(storedReceta.video).toBe(receta.video);
  });

  it('findRecetaByCulturaIdRecetaId should throw an exception for an invalid receta', async () => {
    await expect(() =>
      service.findRecetaByCulturaIdRecetaId(cultura.id, '0'),
    ).rejects.toHaveProperty('message', 'La receta con id dado no se encontró');
  });

  it('findRecetaByCulturaIdRecetaId should throw an exception for an invalid cultura', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.findRecetaByCulturaIdRecetaId('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('findRecetaByCulturaIdRecetaId should throw an exception for an receta not associated to the cultura', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.imageUrl(),
    });

    await expect(() =>
      service.findRecetaByCulturaIdRecetaId(cultura.id, newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'La receta con id dado no esta asociada con la cultura',
    );
  });

  it('findRecetasByCulturaId should return recetas by cultura', async () => {
    const recetas: RecetaEntity[] = await service.findRecetasByCulturaId(
      cultura.id,
    );
    expect(recetas.length).toBe(5);
  });
  it('findRecetasByCulturaId should throw an exception for an invalid cultura', async () => {
    await expect(() =>
      service.findRecetasByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('associateRecetasCultura should update recetas list for a cultura', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.imageUrl(),
    });

    const updatedCultura: CulturaEntity = await service.associateRecetasCultura(
      cultura.id,
      [newReceta],
    );
    expect(updatedCultura.recetas.length).toBe(1);
    expect(updatedCultura.recetas[0].nombre).toBe(newReceta.nombre);
    expect(updatedCultura.recetas[0].descripcion).toBe(newReceta.descripcion);
    expect(updatedCultura.recetas[0].foto).toBe(newReceta.foto);
    expect(updatedCultura.recetas[0].proceso).toBe(newReceta.proceso);
    expect(updatedCultura.recetas[0].video).toBe(newReceta.video);
  });

  it('associateRecetasCultura should throw an exception for an invalid cultura', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.imageUrl(),
    });

    await expect(() =>
      service.associateRecetasCultura('0', [newReceta]),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('associateRecetasCultura should throw an exception for an invalid receta', async () => {
    const newReceta: RecetaEntity = recetasList[0];
    newReceta.id = '0';

    await expect(() =>
      service.associateRecetasCultura(cultura.id, [newReceta]),
    ).rejects.toHaveProperty('message', 'La receta con id dado no se encontró');
  });

  it('deleteRecetaToCultura should remove an receta from a cultura', async () => {
    const receta: RecetaEntity = recetasList[0];

    await service.deleteRecetaCultura(cultura.id, receta.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: cultura.id },
      relations: ['recetas'],
    });
    const deletedReceta: RecetaEntity = storedCultura.recetas.find(
      (a) => a.id === receta.id,
    );

    expect(deletedReceta).toBeUndefined();
  });

  it('deleteRecetaToCultura should thrown an exception for an invalid receta', async () => {
    await expect(() =>
      service.deleteRecetaCultura(cultura.id, '0'),
    ).rejects.toHaveProperty('message', 'La receta con id dado no se encontró');
  });

  it('deleteRecetaToCultura should thrown an exception for an invalid cultura', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.deleteRecetaCultura('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id dado no se encontró',
    );
  });

  it('deleteRecetaToCultura should thrown an exception for an non asocciated receta', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.imageUrl(),
    });

    await expect(() =>
      service.deleteRecetaCultura(cultura.id, newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'La receta con id dado no esta asociada con la cultura',
    );
  });
});
