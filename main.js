const data = require("./data.json");
const fs = require("fs");
const basicURL = "https://dev.virtualearth.net/REST/v1/Routes/";
const BingMapsKey =
  "AnFS3v-4xXtTwePXNAP1cyE2AP3UnosaRI_fCvQZ3m4OM0WSUSPOQnEt3bSFPwDw";

// const maxLength = data.Geral.length;
let maxLength = 3;
let dict = {};
let origem = [];
let destino = [];
let destinoIndex = [];
let tempo = [];
let shortDistance = 99999;
let index = 0;

async function fetchTravelJSON(origin, destination, index) {
  const response = await fetch(
    `${basicURL}DistanceMatrix?origins=${origin}&destinations=${destination}&travelMode=driving&key=${BingMapsKey}`
  );
  const travel = await response.text();
  const travelDistance = parseFloat(
    travel.substr(-175, 28).replace(/[^0-9\-.!? ]/g, "")
  );

  if (
    travelDistance < shortDistance &&
    travelDistance != 0 &&
    !destino.includes(destination)
  ) {
    shortDistance = travelDistance;
    index = index - 1;

    origem.splice(index, 1, origin);
    destino.splice(index, 1, destination);
    tempo.splice(index, 1, shortDistance);

    // console.log(`Origem ${index} é ${origem[index]}   O destino é ${destino[index]}   O tempo é ${tempo[index]}`)

    dict[index] = [
      { Origem: origem[index] },
      { Destino: destino[index] },
      { Distancia: tempo[index] },
    ];

    const nextLocation = data.Geral.findIndex(
      (l) => l.Localização === destino[index]
    );
    destinoIndex.splice(index, 1, nextLocation);
  }
}

async function getDistance(origin) {
  shortDistance = 99999;
  index += 1;

  for (let i = 0; i < maxLength; i++) {
    const start = data.Geral[origin].Localização.replace(/\s/g, "");
    const end = data.Geral[i].Localização.replace(/\s/g, "");

    // console.log(data.Geral.findIndex((location) => location.Localização === [start]));

    await fetchTravelJSON(start, end, index);
  }
}

async function getAllDistances(maxAmountOfStartLocations) {
  for (let i = 0; i < maxAmountOfStartLocations; i++) {
    if (destinoIndex.slice(-1) < 1) {
      await getDistance(0);
    } else {
      await getDistance(i);
    }
  }
}

getAllDistances(maxLength).then(() => {
  // Fazer uma lista que ordena a proxima origem ser igual a o destino passado
  let i = 0;
  let j = 1;
  let destinationOrder = [];

  while (i < maxLength) {
    if (
      (origem[i] == destino[j] && destinationOrder.slice(-1) == destino[j]) ||
      (origem[i] == destino[j] && destinationOrder.length == 0)
    ) {
      destinationOrder.push(destino[j]);
      console.log(
        `Esse é a origem ${origem[i]} e esse é o destino ${destino[i]}`
      );
      console.log(destinationOrder);
      i += 1;
    } else {
      if (j < maxLength) {
        j += 1;
      } else {
        if (i < maxLength) {
          i += 1;
        } else {
          i = 0;
          console.log(`iiiiiiiiiii ${i}`);
        }
        console.log(`jjjjjjjjjj ${j}`);
        j = 0;
      }
    }
  }
  // console.log(dict);

  // console.log(origem);
  // console.log(destino);
});

// A URL do google aceita várias localidades
// Criar uma string para ser usada

// organizar para que a Origem do proximo trajeto seja igual ao Destino do trajeto passado;
// começando pelo index 0

// .then(() => {
//   fs.writeFile(
//     "C:/Codes/localização-gps/data/data.txt",
//     JSON.stringify(dict),
//     "utf8",
//     function (err) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log("The file was saved!");
//     }
//   );
// });
