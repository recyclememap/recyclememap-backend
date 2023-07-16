import request from 'supertest';
import { app } from '@root/app';
import { StatusCodes } from '@root/commons/constants';
import { markersSchema } from '@root/model/schemas';
import {
  createContentErrorMsg,
  createRequiredErrorMsg,
  createTypeErrorMsg
} from '@root/utils/helpers';
import {
  createValidationError,
  extractValidationError,
  gatDataFromDB,
  insertDataToDB
} from '@root/utils/tests/helpers';
import { connectDB, dropDB, dropCollections } from '@utils/tests/dbConnection';
import {
  MOCK_DB_MARKERS,
  MOCK_SUGGESTED_DB_MARKERS,
  MOCK_APPROVED_MARKERS_RESPONSE,
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

  describe('GET /api/markers', () => {
    it('returns 200 with correct markers', async () => {
      await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

      await request(app)
        .get('/api/markers')
        .expect(StatusCodes.Ok)
        .expect((res) => {
          expect(res.body).toStrictEqual(MOCK_APPROVED_MARKERS_RESPONSE);
        });
    });

    it('returns 200 with an empty array if there are no suggested markers in DB', async () => {
      await insertDataToDB(
        MARKERS_DB_NAME,
        MOCK_SUGGESTED_DB_MARKERS,
        markersSchema
      );

      await request(app)
        .get('/api/markers')
        .expect(StatusCodes.Ok)
        .expect((res) => {
          expect(res.body).toStrictEqual([]);
        });
    });
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
        });
    });

    it('returns 400 if there is no "position" in request body', async () => {
      await request(app)
        .post('/api/markers')
        .send({})
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

    it('returns 400 if "position" is not array', async () => {
      await request(app)
        .post('/api/markers')
        .send({ position: 'invalid' })
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
        .send({ position: [1] })
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
        .send({ position: [1, 2, 3] })
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

    it('returns 400 if "position" doesn not contain numbers', async () => {
      await request(app)
        .post('/api/markers')
        .send({ position: ['1', '2'] })
        .expect(StatusCodes.BadRequest)
        .then((res) => {
          expect(extractValidationError(res)).toStrictEqual(
            createValidationError(
              'position',
              'body',
              createContentErrorMsg(
                'position',
                'correct latitude and longitude'
              ),
              { value: ['1', '2'] }
            )
          );
        });
    });
  });
});
