let chartInstance = null;

function showGraph(fieldNumber, sensorName) {
  // Show graph container
  const graphContainer = document.getElementById("graph-container");
  graphContainer.style.display = "block";

  // Fetch data from ThingSpeak
  fetch(`https://api.thingspeak.com/channels/2676023/fields/${fieldNumber}.json?api_key=X5RFW34FCEA1L6YH&results=50`)
  
  .then(response => response.json())
  .then(data => {
    if (data.feeds && data.feeds.length > 0) {
      // Format labels for x-axis
      const labels = data.feeds.map(feed => {
        const date = new Date(feed.created_at);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
      });

      const values = data.feeds.map(feed => feed[`field${fieldNumber}`]);

      // Update or create the chart
      const ctx = document.getElementById("sensor-graph").getContext("2d");

      if (chartInstance) {
        chartInstance.destroy(); // Destroy previous chart
      }

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: `${sensorName} Data`,
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => `Value: ${context.raw}`,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time (HH:MM)",
              },
              ticks: {
                maxRotation: 0, // Prevents labels from overlapping
              },
            },
            y: {
              title: {
                display: true,
                text: "Value",
              },
            },
          },
        },
      });
    }
  })
  .catch(error => console.error("Error fetching data:", error));

}

function hideGraph() {
  // Hide graph container
  const graphContainer = document.getElementById("graph-container");
  graphContainer.style.display = "none";

  // Destroy the chart instance
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

function fetchAndDisplaySensorData(field, sensorName, elementId, threshold) {
  const apiKey = 'X5RFW34FCEA1L6YH'; // Enclose your API key in quotes
  fetch(`https://api.thingspeak.com/channels/2676023/fields/${field}.json?api_key=${apiKey}&results=2`)
    .then(response => response.json())
    .then(data => {
      if (data.feeds && data.feeds.length > 0) {
        const latestEntry = data.feeds[0];
        const value = latestEntry[`field${field}`];
        const exceedsThreshold = value > threshold;

        const sensorElement = document.getElementById(elementId);
        sensorElement.textContent = `${value}`;
        sensorElement.style.color = exceedsThreshold ? 'red' : 'black';
      } else {
        console.error('No data available');
      }
    })
    .catch(error => console.error('Error:', error));
}

// Fetch data for each sensor
fetchAndDisplaySensorData('1', 'Humidity', 'humidity-data', 70);
fetchAndDisplaySensorData('2', 'Temperature', 'temperature-data', 30);
fetchAndDisplaySensorData('3', 'Soil Moisture', 'soil-moisture-data', 50);
fetchAndDisplaySensorData('5', 'Light Intensity', 'light-data', 800);
fetchAndDisplaySensorData('6', 'pH Level', 'pH-data', 7);
fetchAndDisplaySensorData('7', 'Temperature Water Tank', 'temp-water', 7);

let date = new Date();
document.getElementById("date").textContent = date.toLocaleString();
let pumpState = 0; // Initial state of the pump

document.getElementById("btn-on").addEventListener("click", function () {
    // Toggle pumpState between 0 and 1
    
    pumpState = pumpState === 0 ? 1 : 0;
    if(pumpState==0){
      document.getElementById("btn-on").style.backgroundColor = "red";

    }
    else{
      document.getElementById("btn-on").style.backgroundColor = "#4caf50";
    }

    // API URL with the updated field value
    const apiUrl = `https://api.thingspeak.com/update?api_key=WR1MY3YDXF4HM0GT&field8=${pumpState}`;

    // Send GET request
    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                console.log(`Pump state updated successfully to ${pumpState}`);
            } else {
                console.error("Failed to update the pump state.");
            }
        })
        .catch((error) => console.error("Error:", error));
});


