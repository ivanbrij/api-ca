import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './receta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from './receta.entity';
import { faker } from '@faker-js/faker';
import { CulturaEntity } from '../cultura/cultura.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetaList: RecetaEntity[];
  let cultura: CulturaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.cats(),
        proceso: faker.lorem.sentence(),
        video: faker.image.cats(),
      });
      recetaList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create should return a new recipe', async () => {
    const cd = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.cats(),
      proceso: faker.lorem.sentence(),
      video: faker.image.cats(),
      cultura: cultura,
    };

    const newReceta: RecetaEntity = await service.create(cd);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: newReceta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre);
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion);
    expect(storedReceta.foto).toEqual(newReceta.foto);
    expect(storedReceta.proceso).toEqual(newReceta.proceso);
    expect(storedReceta.video).toEqual(newReceta.video);
  });
  it('delete should remove a recipe', async () => {
    const receta: RecetaEntity = recetaList[0];
    await service.delete(receta.id);
    const deletedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(deletedReceta).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    const receta: RecetaEntity = recetaList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La receta con id dado no se encontró',
    );
  });
});
