mapboxgl.accessToken =
  "pk.eyJ1IjoiYXJ5YW4xMDMyIiwiYSI6ImNsNWR1aWd1ZDBsMGozY3BqeG4zc29reDMifQ.gWu4NVyV6hFHB9buceWgBA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [73.815573, 18.517817], // starting position
  zoom: 15.8,
});

console.log(loc.features)
const source = [];
source.push(loc.features.source.longi);
source.push(loc.features.source.lat);

const destination = [];
destination.push(loc.features.destination.longi);
destination.push(loc.features.destination.lat);
// set the bounds of the map
const bounds = [
  [72.0, 18.0],
  [74.0, 19.0],
];
map.setMaxBounds(bounds);

// an arbitrary start will always be the same
// only the end or destination will change
// const start = [73.815329, 18.51553];
// const end = [73.8159148,18.5197903]

const start = source;
const end = destination;

console.log(start);
console.log(end);

// create a function to make a directions request
async function getRoute(end) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: "GET" }
  );
  const json = await query.json();
  const data = json.routes[0];
  console.log(data);
  const route = data.geometry.coordinates;
  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource("route")) {
    map.getSource("route").setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });
  }
  // add turn instructions here at the end
  const instructions = document.getElementById("instructions");
  const steps = data.legs[0].steps;

  let tripInstructions = "";
  for (const step of steps) {
    tripInstructions += `<li>${step.maneuver.instruction}</li>`;
  }
  instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
    data.duration / 60
  )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
}

map.on("load", () => {
  getRoute(start);
  map.addLayer({
    id: "point",
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: start,
            },
          },
        ],
      },
    },
    paint: {
      "circle-radius": 8,
      "circle-color": "#3887be",
    },
  });
  // this is where the code from the next step will go
  getRoute(end);
  map.addLayer({
    id: "point1",
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: end,
            },
          },
        ],
      },
    },
    paint: {
      "circle-radius": 8,
      "circle-color": "#3887be",
    },
  });
});
