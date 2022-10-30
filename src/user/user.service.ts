import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Action } from './Action ';

@Injectable()
export class UserService {
  private users: User[] = [
    //super usuario
    new User(1, 'admin', 'admin', [
      Action.Read,
      Action.Create,
      Action.Delete,
      Action.Update,
      Action.READ_PRODUCT,
    ]),
    new User(2, 'user', 'admin', [Action.Read]), //usuario con permisos de lectura para todos los recursos
    new User(3, 'user_2', 'admin', [Action.Create, Action.Update]), //usuario con permisos de escritura (creación y actualización)
    new User(4, 'user_3', 'admin', [Action.Delete]), //con permisos de eliminación
    new User(5, 'user_4', 'test', [Action.READ_PRODUCT]), //usuario con permisos especificos para el recurso product
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
