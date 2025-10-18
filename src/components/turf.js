import * as turf from '@turf/turf'; 

const polygon = turf.polygon([[
    [-47.78820991516114, -21.20785381859451],
    [-47.78819650411606, -21.208458951501076],
    [-47.78557330369949, -21.208751514868194],
    [-47.78557330369949, -21.208108874915343],
    [-47.78820991516114, -21.20785381859451]
]]);

const verificaPonto = (point) => turf.booleanPointInPolygon(point, polygon);

const calculaDistancia = (point) => turf.pointToPolygonDistance(point, polygon);

export { verificaPonto, calculaDistancia };