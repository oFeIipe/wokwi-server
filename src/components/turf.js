import * as turf from '@turf/turf'; 

//Cria área segura em um retangulo, o primeiro e ultimo ponto são iguais para dar a volta completa
const polygon = turf.polygon([[
    [-47.78820991516114, -21.20785381859451],
    [-47.78819650411606, -21.208458951501076],
    [-47.78557330369949, -21.208751514868194],
    [-47.78557330369949, -21.208108874915343],
    [-47.78820991516114, -21.20785381859451]
]]);


//Usa função da biblioteca turf que verifica se um ponto(no caso recebido do ESP) está dentro de um poligono(Área segura)
const verificaPonto = (point) => turf.booleanPointInPolygon(point, polygon);

//Calcula a distância entre os pontos
const calculaDistancia = (point) => turf.pointToPolygonDistance(point, polygon);

//Exporta as funções
export { verificaPonto, calculaDistancia };