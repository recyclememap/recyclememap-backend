import { DBMarker } from './types';

export class MarkerDto {
  id: string;
  position: number[];
  date: string;

  constructor(marker: DBMarker) {
    this.id = marker.id;
    this.position = marker.position.approvedValue;
    this.date = marker.date;
  }
}

export class NewMarkerDto {
  id: string;
  position: {
    suggestedValue: number[][];
    approvedValue: number[];
  };
  date: string;

  constructor(marker: DBMarker) {
    this.id = marker.id;
    this.position = marker.position;
    this.date = marker.date;
  }
}
