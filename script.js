import { neighborhoods } from './neighborhoods.js';

// Populate the neighborhood dropdown with your imported data.
const neighborhoodSelect = document.getElementById("neighborhood");
neighborhoods.forEach(n => {
  const option = document.createElement("option");
  option.value = n.id;
  option.textContent = n.name;
  neighborhoodSelect.appendChild(option);
});

// Return a random number between min and max.
function getRandomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// Round up acres to two decimal places.
function roundUpAcres(acres) {
  return Math.ceil(acres * 100) / 100;
}

// Create histogram data from an array of numbers.
function createHistogram(data, bins = 20) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const binWidth = range / bins;

  const histogramBins = Array(bins).fill(0).map((_, index) => ({
    binStart: min + index * binWidth,
    binEnd: min + (index + 1) * binWidth,
    count: 0,
  }));

  data.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    histogramBins[binIndex].count++;
  });

  return histogramBins.map(bin => ({
    binRange: `${bin.binStart.toFixed(1)}-${bin.binEnd.toFixed(1)}`,
    binStart: bin.binStart,
    count: bin.count,
  }));
}

// Calculate a single simulation scenario.
function calculateSingleScenario(params) {
  const popChangePercent = getRandomBetween(params.minPopChange, params.maxPopChange) / 100;
  const populationIncrease = Math.round(params.currentPopulation * popChangePercent);
  const householdSize = getRandomBetween(params.minHouseholdSize, params.maxHouseholdSize);
  const newHouseholdsNeeded = Math.ceil(populationIncrease / householdSize);
  const density = getRandomBetween(params.minDensity, params.maxDensity);
  const newAcresNeeded = roundUpAcres(newHouseholdsNeeded / density);

  return {
    popChangePercent,
    populationIncrease,
    householdSize,
    newHouseholdsNeeded,
    density,
    newAcresNeeded,
  };
}

// Calculate the rate of scenarios that exceed the current vacant land.
function calculateExceedanceRate(acreageResults, vacantLand) {
  const exceedingScenarios = acreageResults.filter(acres => acres > vacantLand).length;
  return ((exceedingScenarios / acreageResults.length) * 100).toFixed(1);
}

// Run the simulation for a set number of scenarios.
function runSimulation(params) {
  console.log("Running simulation with params:", params);
  const scenarioCount = 10000;
  const acreageResults = [];

  for (let i = 0; i < scenarioCount; i++) {
    const scenario = calculateSingleScenario(params);
    acreageResults.push(scenario.newAcresNeeded);
  }

  acreageResults.sort((a, b) => a - b);
  const mean = roundUpAcres(
    acreageResults.reduce((sum, val) => sum + val, 0) / scenarioCount
  );
  const percentileIndex = Math.floor(scenarioCount * 0.9);
  const percentile90 = roundUpAcres(acreageResults[percentileIndex]);
  const exceedanceRate = calculateExceedanceRate(acreageResults, params.currentVacantLand);
  const histData = createHistogram(acreageResults);

  updateResults({
    mean,
    percentile90,
    exceedanceRate,
    totalScenarios: scenarioCount,
  });
  updateHistogram(histData, params.currentVacantLand, percentile90);
}

// Update the results section.
function updateResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <h3>Summary Results</h3>
    <p><strong>Mean Additional Acres Needed:</strong> ${results.mean.toFixed(2)} acres</p>
    <p><strong>90th Percentile Additional Acres Needed:</strong> ${results.percentile90.toFixed(2)} acres</p>
    <p><strong>Scenarios Exceeding Current Vacant Land:</strong> ${results.exceedanceRate}%</p>
    <p>Based on ${results.totalScenarios.toLocaleString()} simulated scenarios</p>
  `;
}

let histogramChartInstance = null;
// Update the histogram using Chart.js.
function updateHistogram(data, currentVacantLand, percentile90) {
  const ctx = document.getElementById("histogramChart").getContext("2d");
  const labels = data.map(bin => bin.binRange);
  const counts = data.map(bin => bin.count);

  if (histogramChartInstance) {
    histogramChartInstance.destroy();
  }

  histogramChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Scenarios',
        data: counts,
        backgroundColor: '#6366f1'
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Additional Acres Needed'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Scenarios'
          }
        }
      }
    }
  });
}

// Set up input elements and event listeners.
const populationInput = document.getElementById("currentPopulation");
const vacantLandInput = document.getElementById("currentVacantLand");
const minPopChangeInput = document.getElementById("minPopChange");
const maxPopChangeInput = document.getElementById("maxPopChange");
const minHouseholdSizeInput = document.getElementById("minHouseholdSize");
const maxHouseholdSizeInput = document.getElementById("maxHouseholdSize");
const minDensityInput = document.getElementById("minDensity");
const maxDensityInput = document.getElementById("maxDensity");
const runButton = document.getElementById("runSimulation");

function handleInputChange() {
  const selectedNeighborhood = neighborhoods.find(n => n.id === neighborhoodSelect.value);
  if (selectedNeighborhood) {
    populationInput.value = selectedNeighborhood.population2020;
    vacantLandInput.value = selectedNeighborhood.vacantLand2023;
  }
}

neighborhoodSelect.addEventListener("change", handleInputChange);

runButton.addEventListener("click", () => {
  const params = {
    currentPopulation: parseFloat(populationInput.value),
    currentVacantLand: parseFloat(vacantLandInput.value),
    minPopChange: parseFloat(minPopChangeInput.value),
    maxPopChange: parseFloat(maxPopChangeInput.value),
    minHouseholdSize: parseFloat(minHouseholdSizeInput.value),
    maxHouseholdSize: parseFloat(maxHouseholdSizeInput.value),
    minDensity: parseFloat(minDensityInput.value),
    maxDensity: parseFloat(maxDensityInput.value)
  };
  runSimulation(params);
});
