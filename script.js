import { neighborhoods } from "./neighborhoods.js";

// Function to get a random number between min and max (inclusive)
function getRandomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// Function to round up acres
function roundUpAcres(acres) {
  return Math.ceil(acres * 100) / 100;
}

// Function to create histogram data (same as before)
function createHistogram(data, bins = 20) {
  // ... (same code as you provided) 
}

// Function to calculate a single scenario (takes params as argument)
function calculateSingleScenario(params) {
  const popChangePercent =
    getRandomBetween(params.minPopChange, params.maxPopChange) / 100;
  const populationIncrease = Math.round(
    params.currentPopulation * popChangePercent
  );
  const householdSize = getRandomBetween(
    params.minHouseholdSize,
    params.maxHouseholdSize
  );
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

// Function to calculate exceedance rate (same as before)
function calculateExceedanceRate(acreageResults, vacantLand) {
  // ... (same code as you provided)
}

// Function to run the simulation (takes params as argument)
function runSimulation(params) {
  console.log("Running simulation with params:", params);
  const scenarioCount = 10000;
  const allScenarios = [];
  const acreageResults = [];

  for (let i = 0; i < scenarioCount; i++) {
    const scenario = calculateSingleScenario(params);
    acreageResults.push(scenario.newAcresNeeded);
    allScenarios.push(scenario);
  }

  acreageResults.sort((a, b) => a - b);
  const mean = roundUpAcres(
    acreageResults.reduce((sum, val) => sum + val, 0) / scenarioCount
  );
  const percentileIndex = Math.floor(scenarioCount * 0.9);
  const percentile90 = roundUpAcres(acreageResults[percentileIndex]);
  const exceedanceRate = calculateExceedanceRate(
    acreageResults,
    params.currentVacantLand
  );
  const histData = createHistogram(acreageResults);

  // Update the UI with the results
  updateResults({
    mean,
    percentile90,
    exceedanceRate,
    totalScenarios: scenarioCount,
  });
  updateHistogram(histData, params.currentVacantLand, percentile90);
}

// --- UI Updates ---

function updateResults(results) {
  // ... (same code as you provided)
}

// Function to update the histogram (using Recharts)
function updateHistogram(data, currentVacantLand, percentile90) {
  const histogramDiv = document.getElementById("histogram");
  histogramDiv.innerHTML = ""; // Clear previous chart

  const chart = (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 40, left: 60, bottom: 30 }}
        barSize={16}
        style={{ fontSize: "12px", fontFamily: "system-ui" }}
      >
        {/* ... (rest of your Recharts configuration, 
              including XAxis, YAxis, Tooltip, etc.) */}
      </BarChart>
    </ResponsiveContainer>
  );

  // Render the chart into the histogramDiv
  ReactDOM.render(chart, histogramDiv);
}

// --- Event Listeners ---

// ... (get references to input elements and buttons)

// Add event listeners for input changes
// ... (add event listeners to update the params object)

runButton.addEventListener("click", () => {
  // Gather params from input values
  const params = {
    currentPopulation: parseFloat(populationInput.value),
    currentVacantLand: parseFloat(vacantLandInput.value),
    // ... get other params from input values
  };

  runSimulation(params);
});

// --- Initial UI Setup ---

const appDiv = document.getElementById("app");
appDiv.innerHTML = `
  <h2>Growth-Based Land Need Simulator</h2>
  <p>Simulate land requirements based on population growth scenarios</p>

  <label for="currentPopulation">Current Population:</label>
  <input type="number" id="currentPopulation" value="1000"><br>

  <label for="currentVacantLand">Current Vacant Land (acres):</label>
  <input type="number" id="currentVacantLand" value="100"><br>

  <button id="runSimulation">Run Simulation</button>

  <div id="results"></div> 
  <div id="histogram"></div>
  `;
