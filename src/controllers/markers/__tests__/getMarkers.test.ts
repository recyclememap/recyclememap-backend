import request from 'supertest';
import { app } from '@root/app';
import { StatusCodes } from '@root/commons/constants';
import { WasteTypes } from '@root/facades/markers/types';
import { markersSchema } from '@root/model/schemas';
import { createContentErrorMsg } from '@root/utils/helpers';
import {
  createValidationError,
  extractValidationError,
  insertDataToDB
} from '@root/utils/tests/helpers';
import { connectDB, dropDB, dropCollections } from '@utils/tests/dbConnection';
import {
  MOCK_DB_MARKERS,
  MOCK_SUGGESTED_DB_MARKERS,
  MOCK_APPROVED_MARKERS_RESPONSE,
  MARKERS_DB_NAME,
  MOCK_FILTERED_MARKERS_RESPONSE
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
    it('returns 200 with correct markers if there is no query', async () => {
      await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

      await request(app)
        .get('/api/markers')
        .expect(StatusCodes.Ok)
        .expect((res) => {
          expect(res.body).toStrictEqual(MOCK_APPROVED_MARKERS_RESPONSE);
        });
    });

    it('returns 200 with correct markers if correct query is set', async () => {
      await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

      await request(app)
        .get('/api/markers')
        .query({ wasteTypes: WasteTypes.Carton })
        .expect(StatusCodes.Ok)
        .expect((res) => {
          expect(res.body).toStrictEqual(MOCK_FILTERED_MARKERS_RESPONSE);
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

    describe('wasteTypes validation', () => {
      it('returns 400 if wasteTypes in query are invalid', async () => {
        await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

        await request(app)
          .get('/api/markers')
          .query({ wasteTypes: `invalid,${WasteTypes.Carton}` })
          .expect(StatusCodes.BadRequest)
          .then((res) => {
            expect(extractValidationError(res)).toStrictEqual(
              createValidationError(
                'wasteTypes',
                'query',
                createContentErrorMsg('wasteTypes', 'values'),
                { value: `invalid,${WasteTypes.Carton}` }
              )
            );
          });
      });

      it('returns 400 if wasteTypes in query are not unique', async () => {
        await insertDataToDB(MARKERS_DB_NAME, MOCK_DB_MARKERS, markersSchema);

        await request(app)
          .get('/api/markers')
          .query({
            wasteTypes: `${WasteTypes.Carton},${WasteTypes.Carton},${WasteTypes.Batteries}`
          })
          .expect(StatusCodes.BadRequest)
          .then((res) => {
            expect(extractValidationError(res)).toStrictEqual(
              createValidationError(
                'wasteTypes',
                'query',
                createContentErrorMsg('wasteTypes', 'unique values'),
                {
                  value: `${WasteTypes.Carton},${WasteTypes.Carton},${WasteTypes.Batteries}`
                }
              )
            );
          });
      });
    });
  });
});
