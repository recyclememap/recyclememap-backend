import { ApiError } from '@root/utils/errors';
import {
  createTypeErrorMsg,
  createRequiredErrorMsg,
  createContentErrorMsg
} from '@utils/helpers';

export const newMarkerSchema = {
  position: {
    exists: {
      errorMessage: createRequiredErrorMsg('position')
    },
    isArray: {
      options: { min: 2, max: 2 },
      errorMessage: createTypeErrorMsg('directors', 'array with correct length')
    },
    custom: {
      options: (value: number[]) => {
        if (value.some((element) => typeof element !== 'number')) {
          throw ApiError.BadRequest(
            createContentErrorMsg('position', 'correct latitude and longitude')
          );
        }
        return true;
      }
    }
  }
};
