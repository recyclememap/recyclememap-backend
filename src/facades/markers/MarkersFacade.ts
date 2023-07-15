import { v4 } from 'uuid';
import { MarkersDB } from '@model/schemas';
import { MarkerDto, NewMarkerDto } from '@root/dtos';
import { DBMarker } from '@root/dtos/markersDto/types';
import { ApprovedMarkersList, NewMarker } from './types';

export class MarkersFacade {
  static async getApprovedMarkers(): Promise<ApprovedMarkersList> {
    const approvedMarkers = await MarkersDB.find({
      'position.aprovedValue': { $exists: true, $ne: [] }
    });

    const approvedMarkersDto = approvedMarkers.map(
      (marker) => new MarkerDto(marker as DBMarker)
    );

    return approvedMarkersDto;
  }

  static async setMarker(newMarker: NewMarker): Promise<void> {
    const markerDTO = new NewMarkerDto({
      position: {
        suggestedValue: [newMarker.position],
        approvedValue: []
      },
      id: v4(),
      date: new Date().toISOString()
    });

    await MarkersDB.create(markerDTO);
  }
}
