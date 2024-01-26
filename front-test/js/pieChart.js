var data = [{
    values: [0, 0, 1],
    labels: ['Positive', 'Negative', 'Neutral'],
    type: 'pie'
  }];
  
  var layout = {
  autosize: true,
  responsive: true,

  };
  
  Plotly.newPlot('pieChart', data, layout);