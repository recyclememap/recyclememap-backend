import { v4 } from 'uuid';
import { MarkersDB } from '@model/schemas';
import { MarkerDto, NewMarkerDto } from '@root/dtos';
import { DBMarker } from '@root/dtos/markersDto/types';
import { ApprovedMarkersList, NewMarker } from './types';

export class MarkersFacade {
  static async getApprovedMarkers(): Promise<ApprovedMarkersList> {
    const approvedMarkers = await MarkersDB.find({
      'position.approvedValue': { $exists: true, $ne: [] }
    });

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
      id: v4(),
      date: new Date().toISOString()
    });

    await MarkersDB.create(markerDTO);
  }
}
