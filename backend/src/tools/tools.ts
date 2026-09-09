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
    }
];