import { CreateCarDto } from "../dto/create-car.dto";
import { FetchCarDto } from "../dto/fetch-car.dto";
import { FetchCarWithRulesDto } from '../dto/fetch-car-with-rules.dto';

export class CarMapper {
  static toFetchCarDto(car: any): FetchCarDto {
    return {
      id: car._id || car.id,
      name: car.name,
      description: car.description,
      type: car.type,
      brand: car.brand,
      carModel: car.carModel,
      color: car.color,
      active: car.active,
    };
  }

    static toFetchCarWithRulesDto(car: any): FetchCarWithRulesDto {
    return {
      id: car._id || car.id,
      name: car.name,
      description: car.description,
      type: car.type,
      brand: car.brand,
      carModel: car.carModel,
      color: car.color,
      carRules: car.rules || {},
    };
  }

    static toDomain(createCarDto: CreateCarDto): any {
    return {
      name: createCarDto.name,
      description: createCarDto.description,
      type: createCarDto.type,
      brand: createCarDto.brand,
      carModel: createCarDto.carModel,
      color: createCarDto.color,
      active: true,
      createdAt: new Date(),
    };
  }
}
