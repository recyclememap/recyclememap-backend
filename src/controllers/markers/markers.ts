import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { StatusCodes } from '@root/commons/constants';
import { MarkersFacade } from '@root/facades';
import { facadeRequest } from '@root/utils/helpers';
import {
  getMarkersSchema,
  newMarkerSchema,
  updateMarkerSchema
} from './validation';

export const markers = Router();

/*
 * GET /markers
 */
markers.get(
  '',
  checkSchema(getMarkersSchema, ['query']),
  facadeRequest(async (req, res) => {
    const { wasteTypes } = req.query;
    const markersList = await MarkersFacade.getApprovedMarkers(
      wasteTypes as string
    );

    res.status(StatusCodes.Ok).send(markersList);
  })
);

/*
 * POST /markers
 */
markers.post(
  '',
  checkSchema(newMarkerSchema),
  facadeRequest(async (req, res) => {
    await MarkersFacade.setMarker(req.body);

    res.sendStatus(StatusCodes.Created);
  })
);

/*
 * PATCH /markers/:markerId
 */
markers.patch(
  '/:markerId',
  checkSchema(updateMarkerSchema),
  facadeRequest(async (req, res) => {
    await MarkersFacade.updateMarker(req);

    res.sendStatus(StatusCodes.NoContent);
  })
);
