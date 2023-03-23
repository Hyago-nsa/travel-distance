const data = require("./data.json");
const fs = require("fs");
const basicURL = "https://dev.virtualearth.net/REST/v1/Routes/";
const BingMapsKey =
  "AnFS3v-4xXtTwePXNAP1cyE2AP3UnosaRI_fCvQZ3m4OM0WSUSPOQnEt3bSFPwDw";

// const maxLength = data.Geral.length;
let maxLength = 10;
let dict = {};
let origem = [];
let destino = [];
let destinoIndex = [];
let tempo = [];
let locaisParaIr = [];
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

    dict[index] = [origem[index], destino[index], tempo[index]];

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

getAllDistances(maxLength)
  .then(() => {
    fs.writeFile(
      "C:/Codes/localização-gps/data/data.txt",
      JSON.stringify(dict),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      }
    );
  })
  .then(() => {
    // para cada item no dict, print o index do item onde destino de um item é igual origem de outro item
    const currentOrigin = dict[0][0];
    const currentDestination = dict[0][1];

    locaisParaIr.push(currentDestination);

    console.log("Current Destination = " + currentDestination);
    // console.log(destino.indexOf(currentOrigin));

    for (const [key, value] of Object.entries(dict)) {
      console.log(`Origem : ${value[0]}`);
      console.log(`Destino: ${value[1]}`);

      if (locaisParaIr.slice(-1) == value[0]) {
        console.log("Achei");
        locaisParaIr.push(currentDestination);
        console.log("locais para ir = " + locaisParaIr);
      }
    }

    // console.log(currentOrigin)
    // console.log(currentDestination)
  })
  .then(() => {
    console.log(locaisParaIr);
  });

// A URL do google aceita várias localidades
// Criar uma string para ser usada

// organizar para que a Origem do proximo trajeto seja igual ao Destino do trajeto passado;
// começando pelo index 0
