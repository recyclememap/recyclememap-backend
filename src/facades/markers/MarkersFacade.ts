import { Request } from 'express';
import { v4 } from 'uuid';
import { MarkersDB } from '@model/schemas';
import { GenericObject } from '@root/commons/types';
import { MarkerDto, NewMarkerDto } from '@root/dtos';
import { DBMarker } from '@root/dtos/markersDto/types';
import { ApiError } from '@root/utils/errors';
import {
  ApprovedMarkersList,
  Marker,
  MarkerProperties,
  NewMarker,
  SuggestedMarker
} from './types';

export class MarkersFacade {
  static async getApprovedMarkers(
    wasteTypes: string
  ): Promise<ApprovedMarkersList> {
    const query: GenericObject = {
      'position.approvedValue': { $exists: true, $ne: [] }
    };

    if (wasteTypes) {
      query['wasteTypes.approvedValue'] = { $in: wasteTypes.split(',') };
    }

    const approvedMarkers = await MarkersDB.find(query).exec();

    const approvedMarkersDto = approvedMarkers.map(
      (marker) => new MarkerDto(marker as DBMarker)
    );

    return approvedMarkersDto;
  }

  static async setMarker({
    position,
    wasteTypes,
    address
  }: NewMarker): Promise<void> {
    const markerDTO = new NewMarkerDto({
      position: {
        suggestedValue: [position],
        approvedValue: []
      },
      wasteTypes: {
        suggestedValue: [wasteTypes],
        approvedValue: []
      },
      address: {
        suggestedValue: [address],
        approvedValue: ''
      },
      isPointAvailable: {
        suggestedValue: [],
        approvedValue: true
      },
      id: v4(),
      date: new Date().toISOString()
    });

    await MarkersDB.create(markerDTO);
  }

  static async updateMarker({ params, body }: Request): Promise<void> {
    const suggestedMarker: SuggestedMarker = body;

    const suggestedMarkerProperties = Object.keys(suggestedMarker);

    if (
      suggestedMarkerProperties.length === 0 ||
      !suggestedMarkerProperties.every((property) =>
        Object.values(MarkerProperties).includes(property as MarkerProperties)
      )
    ) {
      throw ApiError.BadRequest(
        'Body contains incorrect properties or is empty'
      );
    }

    const approvedMarker = await MarkersDB.findOne({
      id: params.markerId
    }).exec();

    if (!approvedMarker) {
      throw ApiError.NotFound('Marker not found');
    }

    const approvedMarkerDTO: Marker = new NewMarkerDto(
      approvedMarker as DBMarker
    );

    Object.entries(suggestedMarker).forEach(([property, value]) => {
      approvedMarkerDTO[property as MarkerProperties].suggestedValue.push(
        value as any
      );
    });

    await MarkersDB.replaceOne(
      {
        id: approvedMarkerDTO.id
      },
      approvedMarkerDTO
    ).exec();
  }
}
