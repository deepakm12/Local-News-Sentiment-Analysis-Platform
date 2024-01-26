var eventSource;
// Chart initialization

databox = document.getElementById("dataHere")
// Function to fetch data and update the chart
function fetchDataAndUpdateChart(url) {

  // Establish SSE connection to the server with query parameters

  eventSource = new EventSource(url);

  // Establish SSE connection to the server
  // eventSource = new EventSource('http://127.0.0.1:5000/get_data');

  // Event listener for receiving SSE stream data
  eventSource.addEventListener('message', function (event) {
    var data = JSON.parse(event.data);
    console.log(data);
    dataHere.innerHTML += data["TotalViews"];

  });

  // Error handling for SSE connection
  eventSource.addEventListener('error', function (event) {
    console.error('Error connecting to SSE stream:', event);
    eventSource.close();
  });
}



function play() {
  
  var url = 'http://127.0.0.1:5000/getdata/Modi';
  // Call the function to fetch data and update the chart
  fetchDataAndUpdateChart(url);
}

function stop() {
  // Close the SSE connection
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  location.reload();
}


