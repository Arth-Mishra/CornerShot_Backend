import { BadRequestException } from '@nestjs/common';
import { ProductionDto } from 'src/dto/production.dto';

export const productionUtils = {
  checkEmptyFields: (body: ProductionDto) => {
    const fields = ['name', 'date'];
    for (const field of fields) {
      if (!body[field]) {
        throw new BadRequestException(`Missing field ${field}`);
      }
    }
  },
};
