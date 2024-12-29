import { neighborhoods } from "./neighborhoods.js"; 

// ... (helper functions: getRandomBetween, roundUpAcres, createHistogram, 
//      calculateSingleScenario, calculateExceedanceRate) ... 

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

  // ... (calculate mean, percentile90, exceedanceRate, histData) ...

  updateResults({ 
    mean, 
    percentile90, 
    exceedanceRate, 
    totalScenarios: scenarioCount 
  });
  updateHistogram(histData, params.currentVacantLand, percentile90);
}

function updateResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ` 
    <h3>Summary Results</h3>
    <p><span class="font-medium">Mean Additional Acres Needed:</span> ${results.mean.toFixed(2)} acres</p>
    <p><span class="font-medium">90th Percentile Additional Acres Needed:</span> ${results.percentile90.toFixed(2)} acres</p>
    <p><span class="font-medium">Scenarios Exceeding Current Vacant Land:</span> ${results.exceedanceRate}%</p>
    <p class="text-sm text-gray-500">Based on ${results.totalScenarios.toLocaleString()} simulated scenarios</p>
  `;
}

function updateHistogram(data, currentVacantLand, percentile90) {
  const histogramDiv = document.getElementById("histogram");
  histogramDiv.innerHTML = ""; 

  const chart = (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 40, left: 60, bottom: 30 }}
        barSize={16}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.9} />
        <XAxis
          dataKey="binStart"
          label={{
            value: "Additional Acres Needed",
            position: "bottom",
            offset: 20,
          }}
          tickFormatter={(value) => value.toFixed(0)}
          type="number"
          domain={[0, Math.max(currentVacantLand * 1.1, percentile90 * 1.1)]}
        />
        <YAxis
          label={{
            value: "Number of Scenarios",
            angle: -90,
            position: "insideLeft",
            offset: -45,
          }}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" name="Scenarios" radius={[2, 2, 0, 0]} />
        <ReferenceLine
          x={currentVacantLand}
          stroke="#dc2626"
          strokeWidth={2}
          label={{
            value: "Current Vacant Land",
            position: "top",
            fill: "#dc2626",
            fontSize: 12,
            fontWeight: 500,
            dy: -10,
          }}
        />
        <ReferenceLine
          x={percentile90}
          stroke="#15803d"
          strokeWidth={2}
          strokeDasharray="5 5"
          label={{
            value: "90th Percentile",
            position: "top",
            fill: "#15803d",
            fontSize: 12,
            fontWeight: 500,
            dy: -10,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  ReactDOM.render(chart, histogramDiv);
}


// --- Input Setup and Event Listeners ---

const appDiv = document.getElementById("app");
appDiv.innerHTML = `
  <h2>Growth-Based Land Need Simulator</h2>
  <p>Simulate land requirements based on population growth scenarios</p>

  <div> 
    <label for="neighborhood">Select Neighborhood:</label>
    <select id="neighborhood">
      <option value="">Select a neighborhood...</option>
      ${neighborhoods.map(n => `<option value="${n.id}">${n.name}</option>`).join('')} 
    </select>
  </div>

  <div>
    <label for="currentPopulation">Current Population:</label>
    <input type="number" id="currentPopulation" value="1000">
  </div>

  <div>
    <label for="currentVacantLand">Current Vacant Land (acres):</label>
    <input type="number" id="currentVacantLand" value="100">
  </div>

  <div>
    <label for="minPopChange">Min Population Change (%):</label>
    <input type="number" id="minPopChange" value="0">
  </div>

  <div>
    <label for="maxPopChange">Max Population Change (%):</label>
    <input type="number" id="maxPopChange" value="100">
  </div>

  <div>
    <label for="minHouseholdSize">Min Household Size:</label>
    <input type="number" id="minHouseholdSize" value="2" step="0.1">
  </div>

  <div>
    <label for="maxHouseholdSize">Max Household Size:</label>
    <input type="number" id="maxHouseholdSize" value="4" step="0.1">
  </div>

  <div>
    <label for="minDensity">Min Density (units/acre):</label>
    <input type="number" id="minDensity" value="4">
  </div>

  <div>
    <label for="maxDensity">Max Density (units/acre):</label>
    <input type="number" id="maxDensity" value="12">
  </div>

  <button id="runSimulation">Run Simulation</button>

  <div id="results"></div>
  <div id="histogram"></div>
`;

const neighborhoodSelect = document.getElementById("neighborhood");
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
  const selectedNeighborhood = neighborhoods.find(
    (n) => n.id === neighborhoodSelect.value
  );

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
    maxDensity: parseFloat(maxDensityInput.value),
  };
  runSimulation(params);
});
