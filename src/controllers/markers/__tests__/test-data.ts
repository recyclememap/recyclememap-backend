import { WasteTypes } from '@root/facades/markers/types';

export const MARKERS_DB_NAME = 'Markers';

export const MOCK_DB_MARKERS = [
  {
    id: 'testId',
    position: {
      suggestedValue: [
        [123, 456],
        [222, 333]
      ],
      approvedValue: []
    },
    wasteTypes: {
      suggestedValue: [
        [WasteTypes.Batteries, WasteTypes.Carton],
        [WasteTypes.Packing]
      ],
      approvedValue: []
    },
    address: {
      suggestedValue: ['suggestedAddress'],
      approvedValue: ''
    },
    date: '2023-07-15T21:37:05.406Z'
  },
  {
    id: 'testId2',
    position: {
      suggestedValue: [[123, 456]],
      approvedValue: [1.4, 0.1]
    },
    wasteTypes: {
      suggestedValue: [
        [WasteTypes.Batteries, WasteTypes.Carton],
        [WasteTypes.Packing]
      ],
      approvedValue: [WasteTypes.Carton]
    },
    address: {
      suggestedValue: ['suggestedAddress'],
      approvedValue: 'approvedAddress'
    },
    date: '2023-08-15T21:37:05.406Z'
  },
  {
    id: 'testId3',
    position: {
      suggestedValue: [],
      approvedValue: [1.4, 2.3]
    },
    wasteTypes: {
      suggestedValue: [
        [WasteTypes.Batteries, WasteTypes.Carton, WasteTypes.Packing]
      ],
      approvedValue: [WasteTypes.Batteries]
    },
    address: {
      suggestedValue: [],
      approvedValue: 'approvedAddress'
    },
    date: '2023-09-15T21:37:05.406Z'
  }
];

export const MOCK_SUGGESTED_DB_MARKERS = [
  {
    id: 'testId',
    position: {
      suggestedValue: [
        [123, 456],
        [222, 333]
      ],
      approvedValue: []
    },
    wasteTypes: {
      suggestedValue: [
        [WasteTypes.Batteries, WasteTypes.Carton],
        [WasteTypes.Packing]
      ],
      approvedValue: []
    },
    address: {
      suggestedValue: ['suggestedAddress'],
      approvedValue: []
    },
    date: '2023-07-15T21:37:05.406Z'
  }
];

export const MOCK_APPROVED_MARKERS_RESPONSE = [
  {
    id: 'testId2',
    position: [1.4, 0.1],
    wasteTypes: [WasteTypes.Carton],
    address: 'approvedAddress',
    date: '2023-08-15T21:37:05.406Z'
  },
  {
    id: 'testId3',
    position: [1.4, 2.3],
    wasteTypes: [WasteTypes.Batteries],
    address: 'approvedAddress',
    date: '2023-09-15T21:37:05.406Z'
  }
];

export const MOCK_NEW_MARKER = {
  position: [12.3, 45.6],
  wasteTypes: [WasteTypes.Batteries, WasteTypes.Carton],
  address: 'test address'
};

export const MOCK_DB_NEW_MARKER = {
  id: 'testId',
  position: {
    suggestedValue: [MOCK_NEW_MARKER.position],
    approvedValue: []
  },
  wasteTypes: {
    suggestedValue: [MOCK_NEW_MARKER.wasteTypes],
    approvedValue: []
  },
  address: {
    suggestedValue: [MOCK_NEW_MARKER.address],
    approvedValue: ''
  },
  date: '2023-07-15T21:37:05.406Z'
};
