function fetchAndDisplaySensorData(field, sensorName, elementId, threshold) {
  fetch(`https://api.thingspeak.com/channels/${2676023}/fields/${field}.json?api_key=${X5RFW34FCEA1L6YH}&results=2`)
    .then(response => response.json())
    .then(data => {
      if (data.feeds && data.feeds.length > 0) {
        const latestEntry = data.feeds[0];
        const value = latestEntry[`field${field.replace('field', '')}`];
        const exceedsThreshold = value > threshold;

        const sensorElement = document.getElementById(elementId);
        sensorElement.innerHTML = `${value}`;
        sensorElement.setAttribute('data-exceeds-threshold', exceedsThreshold);
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
fetchAndDisplaySensorData('4', '4thSe', '4thsen-data', 800);
fetchAndDisplaySensorData('5', '5thSe', '5thSen-data', 7);
