import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { StatusCodes } from '@root/commons/constants';
import { MarkersFacade } from '@root/facades';
import { facadeRequest } from '@root/utils/helpers';
import { newMarkerSchema } from './validation';

export const markers = Router();

/*
 * GET /markers
 */
markers.get(
  '',
  facadeRequest(async (req, res) => {
    const markersList = await MarkersFacade.getApprovedMarkers();

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
