var eventSource;

var globalData = []


// Chart initialization
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
        updateVideoCount(data["TotalVideos"]);
        updateCommentsCount(data["CommentCount"]);
        updateViewsCount(data["TotalViews"]);

        var emotions = data["emotionss"][0]
        var maxProb = 0;
        var maxEmotion = ""
        emotions.forEach(element => {

            if (parseFloat(element['score']) > maxProb) {

                maxProb = parseFloat(element['score']);
                maxEmotion = element['label'];
            }

        });

        data["maxEmotion"] = [maxEmotion, maxProb];

        var months = lineChartData.get(maxEmotion)[0];
        var linedata = lineChartData.get(maxEmotion)[1];
        var indexM = getMonthNumber(data['timestamp']) - 1;

        linedata[indexM] += 1;
        lineChartData.set(maxEmotion, [months, linedata])
        updateLinesChart();

        updateBarChart(maxEmotion, 1);
        maxProb = 0;
        maxSentiment = "";
        var sentiments = data['sentiments'][0];
        sentiments.forEach(element => {

            if (element['score'] > maxProb) {

                maxProb = element['score'];
                maxSentiment = element['label'];
            }

        });

        UpdatePieChart(maxSentiment, 1);
        

        var maxExtendedEmotion = -1;
        var maxExtendedLabel = "";

        var extdendedemotions = data["extendedEmotions"][0];

        extdendedemotions.forEach(element => {

            if (parseFloat(element['score']) > maxExtendedEmotion) {

                maxExtendedEmotion = parseFloat(element['score']);
                maxExtendedLabel = element['label'];
            }

        });
        
        data["maxExtendedEmotion"] = [maxExtendedLabel, maxExtendedEmotion];

        globalData.push(data);
        updateTable();
        updateExtendedTable();

       hideLoadingModal();


    });

    // Error handling for SSE connection
    eventSource.addEventListener('error', function (event) {
        console.error('Error connecting to SSE stream:', event);
        eventSource.close();
    });
}

function play(search) {

    var url = new URL('http://127.0.0.1:5000/getdata/' + search);
    showLoadingModal();
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


function updateVideoCount(count) {

    console.log("updated video count")
    const elementID = document.getElementById("video_count")
    elementID.innerHTML = count;
}
function updateViewsCount(count) {

    console.log("updated views count")
    const elementID = document.getElementById("views_count")
    elementID.innerHTML = count;
}
function updateCommentsCount(count) {

    console.log("updated comments count")
    const elementID = document.getElementById("comments_count")
    elementID.innerHTML = count;
}

// document.addEventListener('DOMContentLoaded', function () {
//     console.log("Called api")
//     play();
// });

function getMonthNumber(dateString) {
    // Create a Date object from the input string
    const date = new Date(dateString);

    // Get the month (returns a number from 0 to 11)
    const monthNumber = date.getMonth() + 1; // Adding 1 to convert from 0-based to 1-based index

    return monthNumber;
}

// ---------------------------------------------------- LineCHART -------------------------------------------//

emotions = ["anger", "joy", "trust", "anticipation", "neutral", "surprise", "disgust", "sadness", "fear"]

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthsMap = new Map([['January', 1], ['February', 2], ['March', 3], ['April', 4], ['May', 5], ['June', 6], ['July', 7], ['August', 8], ['September', 9], ['October', 10], ['November', 11], ['December', 12]
]);

var layout = {

    legend: {
        y: 0.5,
        traceorder: 'reversed',
        font: { size: 16 },
        yref: 'paper'
    }
}
var lineChartData = new Map();
emotions.forEach(element => {
    var initialLineCounts = []
    // Example: Print the names of the months
    months.forEach(function (month) {

        initialLineCounts.push(0);

    });
    lineChartData.set(element, [months, initialLineCounts]);

});

// Plotly.newPlot('lineChart', [], layout);

function updateLinesChart() {

    newData = []
    lineChartData.forEach((value, key) => {

        if (key != 'neutral') {

            let trace = {
                x: value[0],
                y: value[1],
                mode: 'lines',
                name: key,
                text: [],
                line: { shape: 'spline' },
                type: 'scatter'
            };
            newData.push(trace);
        }
    });
    // console.log(newData);
    Plotly.newPlot('lineChart', newData, layout);
    // console.log("Updated")

}

updateLinesChart();


// --------------------------------------------------------- PIE CHART -----------------------------------------------------//



var PieChartData = [{
    values: [0, 0, 0],
    labels: ['Positive', 'Negative', 'Neutral'],
    type: 'pie'
}];

var PieChartlayout = {

};


function UpdatePieChart(label, value) {

    console.log("Updated : " + label)
    switch (label) {
        case 'positive':
            PieChartData[0].values[0] += value;
            break;
        case 'negative':
            PieChartData[0].values[1] += value;
            break;
        case 'neutral':
            PieChartData[0].values[2] += value;
            break;
        default:
            break;
    }
    Plotly.newPlot('pieChart', PieChartData, PieChartlayout);

}


// ---------------------------------------------------------------------- BAR CHART -------------------------------------------//

var barlayout = {
    title: "Emotions Plot",
    barmode: "stack",
};
var bar_xdata = emotions;
var bar_ydata = []

bar_xdata.forEach(element => {
    bar_ydata.push(0);
});
const emotionsMap = new Map();

emotions.forEach((emotion, index) => {
    emotionsMap.set(emotion, index); // Adding 1 to convert from 0-based to 1-based index
});


var bartrace = {
    x: bar_xdata,
    y: bar_ydata,
    type: "bar",
    text: yValue.map(String),
    textposition: "auto",
    hoverinfo: "none",
    marker: {
        color: "rgb(158,202,225)",
        opacity: 0.6,
        line: {
            color: "rgb(8,48,107)",
            width: 1,
        },
    },
};

function updateBarChart(emotion, value) {

    var index = emotionsMap.get(emotion);
    bar_ydata[index] += value;

    bartrace.y = bar_ydata;

    Plotly.newPlot("barChart", [bartrace], barlayout);

}

updateBarChart('fear', 0);

// -------------------------------------------------- Populate Table ----------------------------------------------------//

const tableBody = document.getElementById("dataTableRow");
function updateTable() {

    tableBody.innerHTML = "";
    globalData.forEach(element => {

        var comment = element['comment'];
        var likes = element['LikeCount'];
        var replies = element['ReplyCount'];
        var maxEmotion = element['maxEmotion'][0];
        element['maxEmotion'][1] = parseFloat(element['maxEmotion'][1]);
        element['maxEmotion'][1] = parseFloat(element['maxEmotion'][1].toFixed(2));
        var maxProb = element['maxEmotion'][1];

        if (maxEmotion != 'neutral') {

            tableBody.innerHTML += `<tr>
            <td>${comment}</td>
        <td>${likes}</td>
        <td>${replies}</td>
        <td>${maxEmotion}</td>
        <td>${maxProb}</td>
        </tr>`
        }

    });

}


function search() {

    var searchBar = document.getElementById("textField");
    var searchText = searchBar.value;
    play(searchText);

}


// --------------------------------------------------- Extended Emotions Table ------------------------------------------------//
const extendedEmotionstableBody = document.getElementById("dataTableRowExtended");
function updateExtendedTable() {

    extendedEmotionstableBody.innerHTML = "";
    globalData.forEach(element => {

        var comment = element['comment'];
        var maxEmotion = element['maxExtendedEmotion'][0];
        element['maxExtendedEmotion'][1] = parseFloat(element['maxExtendedEmotion'][1]);
        element['maxExtendedEmotion'][1] = parseFloat(element['maxExtendedEmotion'][1].toFixed(2));
        var maxProb = element['maxExtendedEmotion'][1];

        if (maxEmotion != 'neutral') {

            extendedEmotionstableBody.innerHTML += `<tr>
            <td>${comment}</td>
        <td>${maxEmotion}</td>
        <td>${maxProb}</td>
        </tr>`
        }

    });

}



function showLoadingModal() {
    var spinner = document.getElementById("loadingModal");
    spinner.style.display = 'flex';
  }

  function hideLoadingModal() {

    var spinner = document.getElementById("loadingModal");
    spinner.style.display = 'none';
  }
