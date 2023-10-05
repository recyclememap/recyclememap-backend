import { WasteTypes } from '@facades/markers/types';
import { DBMarker } from './types';

export class MarkerDto {
  id: string;
  position: number[];
  date: string;
  wasteTypes: WasteTypes[];
  address: string;

  constructor(marker: DBMarker) {
    this.id = marker.id;
    this.position = marker.position.approvedValue;
    this.wasteTypes = marker.wasteTypes.approvedValue;
    this.address = marker.address.approvedValue;
    this.date = marker.date;
  }
}

export class NewMarkerDto {
  id: string;
  position: {
    suggestedValue: number[][];
    approvedValue: number[];
  };
  wasteTypes: {
    suggestedValue: WasteTypes[][];
    approvedValue: WasteTypes[];
  };
  address: {
    suggestedValue: string[];
    approvedValue: string;
  };
  date: string;

  constructor(marker: DBMarker) {
    this.id = marker.id;
    this.position = marker.position;
    this.date = marker.date;
    this.wasteTypes = marker.wasteTypes;
    this.address = marker.address;
  }
}
