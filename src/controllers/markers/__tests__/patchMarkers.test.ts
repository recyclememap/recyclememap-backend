import request from 'supertest';
import { StatusCodes } from '@commons/constants';
import { markersSchema } from '@model/schemas';
import { app } from '@root/app';
import { WasteTypes } from '@root/facades/markers/types';
import { createContentErrorMsg, createTypeErrorMsg } from '@root/utils/helpers';
import { connectDB, dropDB, dropCollections } from '@utils/tests/dbConnection';
import {
  insertDataToDB,
  gatDataFromDB,
  createValidationError,
  extractValidationError
} from '@utils/tests/helpers';
import {
  MOCK_DB_MARKERS,
  MARKERS_DB_NAME,
  MOCK_SUGGESTION_MARKER,
  MOCK_UPDATED_MARKER,
  LONG_ADDRESS
} from './test-data';

describe('PATCH /api/markers/:markerId', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await dropDB();
  });

  afterEach(async () => {
    await dropCollections();
  });

  it('returns 204 and updates marker in DB', async () => {
    await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

    await request(app)
      .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
      .send(MOCK_SUGGESTION_MARKER)
      .expect(StatusCodes.NoContent)
      .expect(async () => {
        const dbData = await gatDataFromDB(MARKERS_DB_NAME, markersSchema);

        expect(dbData[1].position).toStrictEqual(MOCK_UPDATED_MARKER.position);
        expect(dbData[1].wasteTypes).toStrictEqual(
          MOCK_UPDATED_MARKER.wasteTypes
        );
        expect(dbData[1].address).toStrictEqual(MOCK_UPDATED_MARKER.address);
      });
  });

  it('returns 400 if body contains extra fields', async () => {
    await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

    await request(app)
      .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
      .send({ ...MOCK_SUGGESTION_MARKER, randomField: 'randomValue' })
      .expect(StatusCodes.BadRequest)
      .expect(async (res) => {
        expect(res.body.message).toBe(
          'Body contains incorrect properties or is empty'
        );
      });
  });

  it('returns 400 if body is empty', async () => {
    await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

    await request(app)
      .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
      .send({})
      .expect(StatusCodes.BadRequest)
      .expect(async (res) => {
        expect(res.body.message).toBe(
          'Body contains incorrect properties or is empty'
        );
      });
  });

  it('returns 404 if there is no such marker in database', async () => {
    await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

    await request(app)
      .patch(`/api/markers/invalidId`)
      .send(MOCK_SUGGESTION_MARKER)
      .expect(StatusCodes.NotFound)
      .expect(async (res) => {
        expect(res.body.message).toBe('Marker not found');
      });
  });

  describe('position validation', () => {
    it('returns 400 if "position" is not an array', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, position: 'invalid' })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createTypeErrorMsg('position', 'array with correct length'),
              { value: 'invalid' }
            )
          );
        });
    });

    it('returns 400 if "position" has less than 2 elements', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, position: [1] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createTypeErrorMsg('position', 'array with correct length'),
              { value: [1] }
            )
          );
        });
    });

    it('returns 400 if "position" has more than 2 elements', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, position: [1, 2, 3] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createTypeErrorMsg('position', 'array with correct length'),
              { value: [1, 2, 3] }
            )
          );
        });
    });

    it('returns 400 if "position" does not contain numbers', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, position: ['1', '2'] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createContentErrorMsg('position', 'latitude and longitude'),
              { value: ['1', '2'] }
            )
          );
        });
    });

    it('returns 400 if "position" has lat and long less then allowed coordinates', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, position: [31.751, 34.612] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createContentErrorMsg('position', 'latitude and longitude'),
              { value: [31.751, 34.612] }
            )
          );
        });
    });

    it('returns 400 if "position" has lat and long more then allowed coordinates', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, position: [31.863, 34.704] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createContentErrorMsg('position', 'latitude and longitude'),
              { value: [31.863, 34.704] }
            )
          );
        });
    });
  });

  describe('wasteTypes validation', () => {
    it('returns 400 if "wasteTypes" is not an array', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, wasteTypes: 'incorrect' })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'wasteTypes',
              'body',
              createTypeErrorMsg('wasteTypes', 'array with correct length'),
              { value: 'incorrect' }
            )
          );
        });
    });

    it('returns 400 if "wasteTypes" is empty array', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, wasteTypes: [] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'wasteTypes',
              'body',
              createTypeErrorMsg('wasteTypes', 'array with correct length'),
              { value: [] }
            )
          );
        });
    });

    it('returns 400 if "wasteTypes" has duplicates', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({
          ...MOCK_SUGGESTION_MARKER,
          wasteTypes: [
            WasteTypes.Batteries,
            WasteTypes.Batteries,
            WasteTypes.Packing
          ]
        })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'wasteTypes',
              'body',
              createContentErrorMsg('wasteTypes', 'unique values'),
              {
                value: [
                  WasteTypes.Batteries,
                  WasteTypes.Batteries,
                  WasteTypes.Packing
                ]
              }
            )
          );
        });
    });

    it('returns 400 if "wasteTypes" has incorrect value in array', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({
          ...MOCK_SUGGESTION_MARKER,
          wasteTypes: [WasteTypes.Batteries, 'random', WasteTypes.Packing]
        })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'wasteTypes',
              'body',
              createContentErrorMsg('wasteTypes', 'values'),
              { value: [WasteTypes.Batteries, 'random', WasteTypes.Packing] }
            )
          );
        });
    });
  });

  describe('address validation', () => {
    it('returns 400 if "address" is not string', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, address: 123 })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'address',
              'body',
              createTypeErrorMsg('address', 'string'),
              { value: 123 }
            )
          );
        });
    });

    it('returns 400 if "address" length is more than 70 characters', async () => {
      await request(app)
        .post('/api/markers')
        .send({ ...MOCK_SUGGESTION_MARKER, address: LONG_ADDRESS })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'address',
              'body',
              createTypeErrorMsg('address', 'string'),
              { value: LONG_ADDRESS }
            )
          );
        });
    });

    it('returns 400 if "address" is empty string', async () => {
      await request(app)
        .patch(`/api/markers/${MOCK_DB_MARKERS[1].id}`)
        .send({ ...MOCK_SUGGESTION_MARKER, address: '' })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'address',
              'body',
              createContentErrorMsg('address', 'non-empty value'),
              { value: '' }
            )
          );
        });
    });
  });
});
