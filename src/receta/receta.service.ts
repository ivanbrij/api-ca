import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RecetaService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
  ) {}

  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.recetaRepository.save(receta);
  }
  async delete(id: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con id dado no se encontró',
        BusinessError.NOT_FOUND,
      );

    await this.recetaRepository.remove(receta);
  }

  async findAll(): Promise<RecetaEntity[]> {
    return await this.recetaRepository.find({ });
}
  async findOne(id: string): Promise<RecetaEntity> {
      const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id}} );
      if (!receta)
        throw new BusinessLogicException('La receta con id dado no se encontró', BusinessError.NOT_FOUND);
  
      return receta;
  }
}
