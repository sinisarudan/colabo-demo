import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KnodesService } from 'src/knodes/knodes.service';
import { User } from './entities/user.entity';
import { KNode } from 'src/knodes/entities/knode.entity';
import { throwColaboError } from 'src/common/errors/ColaboError.operator';
import { EColaboErrorKind, EErrorOrigin } from 'src/common/errors/ColaboError';

@Injectable()
export class UsersService {
  constructor(private readonly knodesService: KnodesService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(filterConfig: any): Promise<any[]> {
    return this.knodesService.findAll();
    // return [
    //   `This action returns all users, based on ${JSON.stringify(filterConfig)}`,
    // ];
  }

  findOne(id: string): Promise<KNode | null> {
    return this.knodesService.findOne(id);
  }

  async find(filter: Record<string, any>): Promise<User[]> {
    const userKnodes: KNode[] = await this.knodesService.find(
      this.packUserFilterToKNodeFilter(filter),
    );
    console.log(
      '[UsersService::find] userKnodes',
      JSON.stringify(userKnodes, null, 4),
    );
    const users: User[] = userKnodes.map((kNode: KNode) =>
      this.unpackUserFromKNode(kNode),
    );
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users: User[] = await this.find({ email: email });
    console.log('[UsersService::findByEmail] users', users);
    if (users.length === 1) {
      return users[0];
    } else if (users.length === 0) {
      return null;
    }
    throwColaboError(
      `${users.length} users found by one email ${email}`,
      EErrorOrigin.DOMAIN,
      EColaboErrorKind.DATA_INCORRECT_FORMAT,
    );
    // needed only because `throwColaboError` is not recognized correctly as returning `never`
    return null;
  }

  packUserFilterToKNodeFilter(
    filter: Record<string, any>,
  ): Record<string, any> {
    const transformedFilter: Record<string, any> = {};
    Object.keys(filter).forEach((key: string) => {
      transformedFilter[`dataContent.${key}`] = filter[key];
    });
    return transformedFilter;
  }

  unpackUserFromKNode(kNode: KNode): User {
    const userData = kNode.dataContent ?? {};
    const user: User = {
      id: kNode._id,
      firstName: userData.firstName as string,
      lastName: userData.lastName as string,
      email: userData.email as string,
      roles: userData.roles as string[],
      bio: userData.bio as string,
      password: userData.password as string,
      username: kNode.name,
    };
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
