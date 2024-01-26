var xValue = [];

var yValue = [];

var trace1 = {
  x: xValue,
  y: yValue,
  type: "bar",
  text: yValue.map(String),
  textposition: "auto",
  hoverinfo: "none",
  marker: {
    color: "rgb(158,202,225)",
    opacity: 0.6,
    line: {
      color: "rgb(8,48,107)",
      width: 1.5,
    },
  },
};

var data = [trace1];

var layout = {
  title: "Emotions Plot",
  barmode: "stack",
};

Plotly.newPlot("barChart", data, layout);
