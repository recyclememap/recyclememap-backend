import { WasteTypes } from '@root/facades/markers/types';
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
      errorMessage: createTypeErrorMsg('position', 'array with correct length')
    },
    custom: {
      options: (value: number[]) => {
        if (value.some((element) => typeof element !== 'number')) {
          throw ApiError.BadRequest(
            createContentErrorMsg('position', 'latitude and longitude')
          );
        }

        return true;
      }
    }
  },
  wasteTypes: {
    exists: {
      errorMessage: createRequiredErrorMsg('wasteTypes')
    },
    isArray: {
      options: { min: 1 },
      errorMessage: createTypeErrorMsg(
        'wasteTypes',
        'array with correct length'
      )
    },
    custom: {
      options: (wasteTypes: WasteTypes[]) => {
        if (wasteTypes.length > 1) {
          const uniqueValues = new Set(wasteTypes);

          if (uniqueValues.size !== wasteTypes.length) {
            throw ApiError.BadRequest(
              createContentErrorMsg('wasteTypes', 'unique values')
            );
          }
        }

        wasteTypes.forEach((wasteType) => {
          if (!Object.values(WasteTypes).includes(wasteType)) {
            throw ApiError.BadRequest(
              createContentErrorMsg('wasteTypes', 'values')
            );
          }
        });

        return true;
      }
    }
  },
  address: {
    exists: { errorMessage: createRequiredErrorMsg('address') },
    isString: {
      errorMessage: createTypeErrorMsg('address', 'string')
    },
    custom: {
      options: (value: string) => {
        if (!value.trim()) {
          throw ApiError.BadRequest(
            createContentErrorMsg('address', 'non-empty value')
          );
        }
        return true;
      }
    }
  }
};
