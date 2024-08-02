import { BadRequestException } from '@nestjs/common';
import { ContestantDto } from 'src/dto/contestant.dto';

export const contestantUtil = {
  /**
   * TODO
   * @Snehil Sharma please remove the fields which are not mandatory
   */
  checkEmptyFields: (body: ContestantDto) => {
    const fields = [
      'name',
      'phone_number',
      'email',
      'header_rating',
      'healer_rating',
    ];
    for (const field of fields) {
      if (!body[field]) {
        throw new BadRequestException(`Missing field ${field}`);
      }
    }
  },
};
