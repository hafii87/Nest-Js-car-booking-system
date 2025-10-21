import { CreateUserDto } from "../dto/create-user.dto";
import { FetchUserDto } from "../dto/fetch-user.dto";
import { FetchUserWithBookingsDto } from "../dto/fetch-user-with-bookings.dto";
import { FetchUserWithGroupsDto } from  "../dto/fetch-user-with-groups.dto";

export class UserMapper {
  static toFetchUserDto(user: any): FetchUserDto {
    return {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      active: user.active
    };
  }

  static toFetchUserWithBookingsDto(user: any): FetchUserWithBookingsDto {
    return {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bookings: user.bookings || [],
    };
    }

    static toFetchUserWithGroupsDto(user: any): FetchUserWithGroupsDto {
        return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        groups: user.groups || [],
        };
    }

    static toDomain(createUserDto: CreateUserDto): any {
    return {
      name: createUserDto.name,
      email: createUserDto.email,
        phone: createUserDto.phone,
        address: createUserDto.address,
        active: true,
        createdAt: new Date(),
    };
    }
}