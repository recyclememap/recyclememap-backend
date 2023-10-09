import request from 'supertest';
import { app } from '@root/app';
import { StatusCodes } from '@root/commons/constants';
import { WasteTypes } from '@root/facades/markers/types';
import { markersSchema } from '@root/model/schemas';
import {
  createContentErrorMsg,
  createRequiredErrorMsg,
  createTypeErrorMsg
} from '@root/utils/helpers';
import {
  createValidationError,
  extractValidationError,
  gatDataFromDB
} from '@root/utils/tests/helpers';
import { connectDB, dropDB, dropCollections } from '@utils/tests/dbConnection';
import {
  MOCK_NEW_MARKER,
  MARKERS_DB_NAME,
  MOCK_DB_NEW_MARKER
} from './test-data';

describe('Markers controller', () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterAll(async () => {
    await dropDB();
  });
  afterEach(async () => {
    await dropCollections();
  });

  describe('POST /api/markers', () => {
    it('returns 201 and save correct data in DB', async () => {
      await request(app)
        .post('/api/markers')
        .send(MOCK_NEW_MARKER)
        .expect(StatusCodes.Created)
        .expect(async () => {
          const dbData = await gatDataFromDB(MARKERS_DB_NAME, markersSchema);

          expect(dbData[0].position).toStrictEqual(MOCK_DB_NEW_MARKER.position);
          expect(dbData[0].wasteTypes).toStrictEqual(
            MOCK_DB_NEW_MARKER.wasteTypes
          );
          expect(dbData[0].address).toStrictEqual(MOCK_DB_NEW_MARKER.address);
        });
    });

    describe('position validation', () => {
      it('returns 400 if there is no "position" in request body', async () => {
        await request(app)
          .post('/api/markers')
          .send({
            address: MOCK_NEW_MARKER.address,
            wasteTypes: MOCK_NEW_MARKER.wasteTypes
          })
          .expect(StatusCodes.BadRequest)
          .then((res) => {
            expect(extractValidationError(res)).toStrictEqual(
              createValidationError(
                'position',
                'body',
                createRequiredErrorMsg('position')
              )
            );
          });
      });

      it('returns 400 if "position" is not an array', async () => {
        await request(app)
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, position: 'invalid' })
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
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, position: [1] })
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
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, position: [1, 2, 3] })
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
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, position: ['1', '2'] })
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
    });

    describe('wasteTypes validation', () => {
      it('returns 400 if there is no "wasteTypes" in request body', async () => {
        await request(app)
          .post('/api/markers')
          .send({
            position: MOCK_NEW_MARKER.position,
            address: MOCK_NEW_MARKER.address
          })
          .expect(StatusCodes.BadRequest)
          .then((res) => {
            expect(extractValidationError(res)).toStrictEqual(
              createValidationError(
                'wasteTypes',
                'body',
                createRequiredErrorMsg('wasteTypes')
              )
            );
          });
      });

      it('returns 400 if "wasteTypes" is not an array', async () => {
        await request(app)
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, wasteTypes: 'incorrect' })
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
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, wasteTypes: [] })
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
          .post('/api/markers')
          .send({
            ...MOCK_NEW_MARKER,
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
          .post('/api/markers')
          .send({
            ...MOCK_NEW_MARKER,
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
      it('returns 400 if there is no "address" in request body', async () => {
        await request(app)
          .post('/api/markers')
          .send({
            position: MOCK_NEW_MARKER.position,
            wasteTypes: MOCK_NEW_MARKER.wasteTypes
          })
          .expect(StatusCodes.BadRequest)
          .then((res) => {
            expect(extractValidationError(res)).toStrictEqual(
              createValidationError(
                'address',
                'body',
                createRequiredErrorMsg('address')
              )
            );
          });
      });

      it('returns 400 if "address" is not string', async () => {
        await request(app)
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, address: 123 })
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

      it('returns 400 if "address" is empty string', async () => {
        await request(app)
          .post('/api/markers')
          .send({ ...MOCK_NEW_MARKER, address: '' })
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
});
