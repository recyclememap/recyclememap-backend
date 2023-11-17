import { AshdodCoordinates } from '@root/commons/constants';
import { WasteTypes } from '@root/facades/markers/types';
import { ApiError } from '@root/utils/errors';
import {
  createTypeErrorMsg,
  createRequiredErrorMsg,
  createContentErrorMsg
} from '@utils/helpers';

const MAX_ADDRESS_LENGTH = 70;

const positionValidation = (position: number[]) => {
  if (position.some((coordinate) => typeof coordinate !== 'number')) {
    throw ApiError.BadRequest(
      createContentErrorMsg('position', 'latitude and longitude')
    );
  }

  const lat = position[0];
  const lng = position[1];

  if (
    lat < AshdodCoordinates.LatMin ||
    lat > AshdodCoordinates.LatMax ||
    lng < AshdodCoordinates.LngMin ||
    lng > AshdodCoordinates.LngMax
  ) {
    throw ApiError.BadRequest(
      createContentErrorMsg('position', 'latitude and longitude')
    );
  }

  return true;
};

const wasteTypesVaildation = (wasteTypes: WasteTypes[]) => {
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
      throw ApiError.BadRequest(createContentErrorMsg('wasteTypes', 'values'));
    }
  });

  return true;
};

const addressValidation = (address: string) => {
  if (!address.trim()) {
    throw ApiError.BadRequest(
      createContentErrorMsg('address', 'non-empty value')
    );
  }
  return true;
};

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
      options: positionValidation
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
      options: wasteTypesVaildation
    }
  },
  address: {
    exists: { errorMessage: createRequiredErrorMsg('address') },
    isString: {
      errorMessage: createTypeErrorMsg('address', 'string')
    },
    isLength: {
      options: { max: MAX_ADDRESS_LENGTH },
      errorMessage: createTypeErrorMsg('address', 'string')
    },
    custom: {
      options: addressValidation
    }
  }
};

export const updateMarkerSchema = {
  position: {
    optional: { options: { nullable: true } },
    isArray: {
      options: { min: 2, max: 2 },
      errorMessage: createTypeErrorMsg('position', 'array with correct length')
    },
    custom: {
      options: positionValidation
    }
  },
  wasteTypes: {
    optional: { options: { nullable: true } },
    isArray: {
      options: { min: 1 },
      errorMessage: createTypeErrorMsg(
        'wasteTypes',
        'array with correct length'
      )
    },
    custom: {
      options: wasteTypesVaildation
    }
  },
  address: {
    optional: { options: { nullable: true } },
    isString: {
      errorMessage: createTypeErrorMsg('address', 'string')
    },
    isLength: {
      options: { max: MAX_ADDRESS_LENGTH },
      errorMessage: createTypeErrorMsg('address', 'string')
    },
    custom: {
      options: addressValidation
    }
  }
};
