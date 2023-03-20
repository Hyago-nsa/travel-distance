const data = require("./data.json");
const fs = require("fs");
const basicURL = "https://dev.virtualearth.net/REST/v1/Routes/";
const BingMapsKey =
  "AnFS3v-4xXtTwePXN  AP1cyE2AP3UnosaRI_fCvQZ3m4OM0WSUSPOQnEt3bSFPwDw";

const maxLength = data.Geral.length;
const start = "";
const end = "";
const dict = {};
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

  if (travelDistance < shortDistance && travelDistance != 0) {
    shortDistance = travelDistance;

    dict[index] = [
      { "Origem : ": origin },
      { "Destino : ": destination },
      { "Distancia : ": travelDistance },
    ];

    console.log(dict);

    // fs.writeFile(
    //   "C:/Codes/localização-gps/data/data.csv",
    //   JSON.stringify(dict),
    //   "utf8",
    //   function (err) {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     console.log("The file was saved!");
    //   }
    // );
  }
}

async function getDistance(origin, maxAmountOfEndLocations) {
  shortDistance = 99999;
  index += 1;

  for (let i = 0; i < maxAmountOfEndLocations; i++) {
    const start = data.Geral[origin].Localização.replace(/\s/g, "");
    const end = data.Geral[i].Localização.replace(/\s/g, "");

    await fetchTravelJSON(start, end, index);
  }
}

async function getAllDistances(maxAmountOfStartLocations) {
  for (let i = 0; i < maxAmountOfStartLocations; i++) {
    await getDistance(i, 10);
  }
}

getAllDistances(3);
