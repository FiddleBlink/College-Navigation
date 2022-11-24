const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'pie',
    data: {
    labels: ['DR', 'KS', 'Main Gate', 'Basketball'],
    datasets: [{
        label: 'Visited',
        data: [12, 19, 3, 5],
    }]
    }
});
