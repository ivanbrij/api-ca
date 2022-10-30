import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaRecetaService {

  cacheKey: string = "artists";

  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async addRecetaCultura(
    culturaId: string,
    recetaId: string,
  ): Promise<CulturaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura gastronomica con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    cultura.recetas = [...cultura.recetas, receta];
    return await this.culturaRepository.save(cultura);
  }

  async findRecetaByCulturaIdRecetaId(
    culturaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura gastronomica con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    const culturaReceta: RecetaEntity = cultura.recetas.find(
      (e) => e.id === receta.id,
    );

    if (!culturaReceta)
      throw new BusinessLogicException(
        'La receta con id dado no esta asociada con la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    return culturaReceta;
  }

  async findRecetasByCulturaId(culturaId: string): Promise<RecetaEntity[]> {
    const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);
    
    if(!cached){
        const cultura: CulturaEntity = await this.culturaRepository.findOne({
          where: { id: culturaId },
          relations: ['recetas'],
        });
        if (!cultura)
          throw new BusinessLogicException(
            'La cultura gastronomica con id dado no se encontró',
            BusinessError.NOT_FOUND,
          );
        await this.cacheManager.set(this.cacheKey, cultura.recetas);
        return cultura.recetas;
        }
    return cached;   
  }

  async associateRecetasCultura(
    culturaId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });

    if (!cultura)
      throw new BusinessLogicException(
        'La cultura gastronomica con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < recetas.length; i++) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id: recetas[i].id },
      });
      if (!receta)
        throw new BusinessLogicException(
          'La receta con id dado no se encontró',
          BusinessError.NOT_FOUND,
        );
    }

    cultura.recetas = recetas;
    return await this.culturaRepository.save(cultura);
  }

  async deleteRecetaCultura(culturaId: string, recetaId: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'La cultura gastronomica con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    const culturaReceta: RecetaEntity = cultura.recetas.find(
      (e) => e.id === receta.id,
    );

    if (!culturaReceta)
      throw new BusinessLogicException(
        'La receta con id dado no esta asociada con la cultura',
        BusinessError.PRECONDITION_FAILED,
      );

    cultura.recetas = cultura.recetas.filter((e) => e.id !== recetaId);
    await this.culturaRepository.save(cultura);
  }
}
