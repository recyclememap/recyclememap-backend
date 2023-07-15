export type ApprovedMarker = {
  id: string;
  position: number[];
  date: string;
};

export type ApprovedMarkersList = ApprovedMarker[];

export type NewMarker = {
  position: number[];
};
