import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { DeliveryEntity, LogEntity, UserEntity } from '../database/entities';
import {
  CreateUserDto,
  ListUserQueryDTO,
  ListUsersResult,
  UpdateUserDto,
  UserResult,
} from './dto';
import { StatusDelivery, UserType } from '../shared/constants/enums.constants';
import { addHours } from 'date-fns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: MongoRepository<DeliveryEntity>,
    @InjectRepository(LogEntity)
    private readonly logRepository: MongoRepository<LogEntity>,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserResult> {
    const existsUserWithThisUsername = await this.userRepository.findOneBy({
      user: data.user,
    });

    if (existsUserWithThisUsername) {
      throw new BadRequestException('Já existe um usuário com esse user.');
    }

    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(data.password, salt);

    const phone = data.phone
      .replace('(', '')
      .replace(')', '')
      .replace('-', '')
      .replace(' ', '');

    try {
      const newUser = await this.userRepository.save({
        id: uuid(),
        ...data,
        phone,
        password: passHash,
        isActive: true,
        createdAt: addHours(new Date(), -3),
        updatedAt: addHours(new Date(), -3),
      });
      return UserResult.fromEntity(newUser);
    } catch (error) {
      return error;
    }
  }

  async listUsers(
    userId: string,
    queryParams: ListUserQueryDTO,
  ): Promise<ListUsersResult> {
    const userFinded = await this.userRepository.findOneBy({
      id: userId,
    });

    const order = {
      name: 'ASC',
    };

    const skip = (queryParams.page - 1) * queryParams.itemsPerPage;
    const take = queryParams.itemsPerPage;
    let where = {};
    where['isActive'] = true;
    let users = [];

    if (queryParams.isNotActive) {
      where['isActive'] = false;
    }

    if (queryParams.type) {
      if (userFinded.type === UserType.ADMIN) {
        if (queryParams.type === UserType.SHOPKEEPER) {
          where = {
            ...where,
            type: { $in: [UserType.SHOPKEEPER, UserType.SHOPKEEPERADMIN] },
          };
        } else {
          where = { ...where, type: queryParams.type };
        }
      } else if (userFinded.type === UserType.MOTOBOY) {
        if (queryParams.type === UserType.MOTOBOY) {
          return ListUsersResult.fromEntities([userFinded], 1, 1);
        } else {
          where = {
            ...where,
            type: { $in: [UserType.SHOPKEEPER, UserType.SHOPKEEPERADMIN] },
          };
        }
      } else if (
        //Se ele for um lojista ou um lojista admin, só pode ver ele mesmo como lojista
        userFinded.type === UserType.SHOPKEEPER ||
        userFinded.type === UserType.SHOPKEEPERADMIN
      ) {
        if (queryParams.type === UserType.SHOPKEEPER) {
          return ListUsersResult.fromEntities([userFinded], 1, 1);
        } else {
          where = {
            ...where,
            type: queryParams.type,
          };
        }
      }
    }

    try {
      users = await this.userRepository.find({ where, skip, take, order });
    } catch (error) {
      return error;
    }

    return ListUsersResult.fromEntities(users, users.length, queryParams.page);
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    const existsUserWithThisUsername = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!existsUserWithThisUsername) {
      throw new BadRequestException('Não existe um usuário com esse user.');
    }

    try {
      const changedUser = await this.userRepository.save({
        ...existsUserWithThisUsername,
        ...data,
        updatedAt: addHours(new Date(), -3),
      });
      return UserResult.fromEntity(changedUser);
    } catch (error) {
      return error;
    }
  }

  async resetUserPassword(userId: string) {
    const existsUserWithThisUsername = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!existsUserWithThisUsername) {
      throw new BadRequestException('Não existe um usuário com esse user.');
    }

    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash('123456', salt);

    try {
      const changedUser = await this.userRepository.save({
        ...existsUserWithThisUsername,
        password: passHash,
        updatedAt: addHours(new Date(), -3),
      });
      return UserResult.fromEntity(changedUser);
    } catch (error) {
      return error;
    }
  }

  async getMyself(userId: string) {
    try {
      const myself = await this.userRepository.findOneBy({
        id: userId,
      });
      return UserResult.fromEntity(myself);
    } catch (error) {
      return error;
    }
  }

  async findUserByUsername(user: string) {
    try {
      const userFinded = await this.userRepository.findOneBy({
        user,
      });
      return UserResult.fromEntity(userFinded);
    } catch (error) {
      return error;
    }
  }

  async findMotoboys(
    userType: string,
    userId: string,
  ): Promise<Record<string, string>[]> {
    let where;
    const order = {
      name: 'ASC',
    };

    if (userType === UserType.MOTOBOY) {
      where = { id: userId };
    } else {
      where = {
        type: UserType.MOTOBOY,
      };
    }
    try {
      const motoboys = await this.userRepository.find({
        where,
        order,
      });

      const motoboysWithDeliveriesCount = await Promise.all(
        motoboys.map(async (motoboy) => {
          const countDeliveries = await this.deliveryRepository.count({
            isActive: true,
            'motoboy.id': motoboy.id,
            status: {
              $in: [
                StatusDelivery.PENDING,
                StatusDelivery.ONCOURSE,
                StatusDelivery.COLLECTED,
              ],
            },
          });

          const where = {
            'motoboy.id': motoboy.id,
            status: StatusDelivery.FINISHED,
          };
          const order = { finishedAt: 'DESC' };
          const take = 1;

          const lastDelivery = await this.deliveryRepository.find({
            where,
            order,
            take,
          });

          return {
            name: `${motoboy.name} - ${countDeliveries}`,
            lastDeliveryDate: lastDelivery,
            id: motoboy.id,
          };
        }),
      );

      return await this.changeNameForMotoboy(motoboysWithDeliveriesCount);
    } catch (error) {
      return error;
    }
  }

  async changeNameForMotoboy(motoboysWithDeliveriesCount) {
    const newArrayForMotoboys = [];
    motoboysWithDeliveriesCount.map(async (motoboy) => {
      let hour = 'sem ultima entrega';
      if (motoboy.lastDeliveryDate[0]) {
        const dateArray = `${motoboy.lastDeliveryDate[0].finishedAt}`.split(
          ' ',
        );
        hour = `${dateArray[4].substring(0, 5)} horas`;
      }

      newArrayForMotoboys.push({
        name: `${motoboy.name} - ${hour}`,
        id: motoboy.id,
      });

      return {
        name: `${motoboy.name} - ${hour}`,
        id: motoboy.id,
      };
    });

    return newArrayForMotoboys;
  }

  async updateUserNotification(data: UpdateUserDto, user: string) {
    const existsUserWithThisUsername = await this.userRepository.findOneBy({
      user,
    });

    if (!existsUserWithThisUsername) {
      throw new BadRequestException('Não existe um usuário com esse user.');
    }

    const newLog = {
      id: uuid(),
      where: 'Atualizar notificação',
      type: 'Log para atualizar notificação',
      error: JSON.stringify(data.notification),
      user: existsUserWithThisUsername,
      status: 'notificação do usuário atualizada',
    };

    try {
      const changedUser = await this.userRepository.save({
        ...existsUserWithThisUsername,
        notification: data.notification,
        updatedAt: addHours(new Date(), -3),
      });
      await this.logRepository.save(newLog);
      return UserResult.fromEntity(changedUser);
    } catch (error) {
      const newLogError = {
        id: uuid(),
        where: 'Atualizar notificação',
        type: 'Log para atualizar notificação',
        error: `${error}`,
        user: existsUserWithThisUsername,
        status: JSON.stringify(data.notification),
      };
      await this.logRepository.save(newLogError);
      return error;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.userRepository.deleteOne({ id });

      return { status: 200, message: 'Usuário apagado com sucesso.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro na base de dados.',
      );
    }
  }
}
