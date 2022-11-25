let val = []
val.push(Frequently_visited.features[0].count);
val.push(Frequently_visited.features[1].count);
val.push(Frequently_visited.features[2].count);
val.push(Frequently_visited.features[3].count);

let locname = []
locname.push(Frequently_visited.features[0].Loc_Name);
locname.push(Frequently_visited.features[1].Loc_Name);
locname.push(Frequently_visited.features[2].Loc_Name);
locname.push(Frequently_visited.features[3].Loc_Name);

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'pie',
    data: {
    labels: locname,
    datasets: [{
        label: 'Visited',
        data: val,
    }]
    }
});