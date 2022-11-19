mapboxgl.accessToken =
    "pk.eyJ1IjoiYXJ5YW4xMDMyIiwiYSI6ImNsNWR1aWd1ZDBsMGozY3BqeG4zc29reDMifQ.gWu4NVyV6hFHB9buceWgBA";
const start = [73.815329, 18.51553];
const end = [73.8159148, 18.5197903]
async function run() {
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
    );
    const json = await query.json();
    const data = json.routes[0];
    console.log(data);
}
run();

