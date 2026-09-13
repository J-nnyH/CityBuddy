export const tools= [
   {
    type: 'function',
    function: {
        name: 'getStationsWithBikes',
        description: 'Liefert Fahrradstationen mit verfügbaren Fahrrädern.',
        parameters: {
            type: 'object',
            properties: {
                minNumOfBikes: {
                    type: 'number',
                    description: 'Mindestanzahl verfügbarer Fahrräder'
                }
            },
        required: ['minNumOfBikes'],
        }
    }
    },
    {
    type: 'function',
    function: {
      name: 'getStationsWithFreeDocks',
      description: 'Liefert Fahrradstationen mit mindestens der angegebenen Anzahl verfügbarer Stellplätze.',
      parameters: {
        type: 'object',
        properties: {
          minNumOfDocks: {
            type: 'number',
            description: 'Mindestanzahl verfügbarer Stellplätze'
          }
        },
        required: ['minNumOfDocks']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getStationStatus',
      description: 'Liefert den aktuellen Fahrradbestand und die verfügbaren Stellplätze aller Fahrradstationen, deren Name den angegebenen Namen oder Teil des Namens enthält.',
      parameters: {
        type: 'object',
        properties: {
          stationName: {
            type: 'string',
            description: 'Name oder Teil des Namens der Fahrradstation'
          }
        },
        required: ['stationName']
      }
    }
  }
];