# 10,000 Futures: Monte Carlo Land Use Simulation & Explorer

An interactive, browser-based spatial simulation tool designed to model, forecast, and visualize probabilistic land use scenarios for urban land bank parcels. Built for planners, community developers, and urban researchers, this application runs stochastic Monte Carlo simulations directly in the client to project alternative futures for vacant land management.

---

## Key Features

* **Stochastic Land Use Modeling:** Simulate thousands of potential future conditions across vacant parcels based on configurable transition probabilities.
* **Interactive Web Mapping:** Powered by Leaflet.js with multi-layer basemap switching (Carto Light, Esri Satellite, OpenStreetMap) for precise spatial context.
* **Real-time Analytics Dashboard:** Instantly compute aggregate metrics—tracking parcel counts and total acreage dynamically as scenarios evolve or get modified.
* **Scenario Branching & Version Control:** Fork simulations into distinct "branches" to compare alternative policy outcomes side-by-side without mutating baseline data.
* **GeoJSON Interoperability:** Seamlessly import existing municipal parcel datasets and export simulation outcomes for reporting or downstream GIS workflows.

---

## Getting Started

Because the application fetches local spatial datasets and runs asynchronously in the browser, it requires a local HTTP server to prevent CORS (Cross-Origin Resource Sharing) blocks.

### Prerequisites
* A modern web browser (Chrome, Firefox, Safari, Edge)
* Python 3.x or Node.js (for running a local server)

### Installation & Execution

1. **Clone the repository:**

    git clone https://github.com/timothydehm/montecarlo.git
    cd montecarlo

2. **Start a local development server:**

    *Using Python:*
    python3 -m http.server 8000

    *Using Node.js (http-server):*
    npx http-server

3. **Open the application:**
   Navigate to `http://localhost:8000` in your browser.

---

## Data Structure

The application consumes standard **GeoJSON** feature collections. To enable full analytical capability, feature `properties` should include:
* `landUse` *(String)*: Current or assigned category (`Unassigned`, `Green Space`, `Residential`, `Commercial`, `Other`).
* `total_square_ft` *(Number)*: Parcel area in square feet, utilized for automated acreage calculations.

---

## Usage Guide

1. **Simulate & Inspect:** Click on individual parcels on the map to manually override classifications, or trigger batch Monte Carlo simulations through the control panel.
2. **Manage Versions:** Use the **Version Control** section to create and switch between distinct planning scenarios. 
3. **Export Results:** Click **Download GeoJSON** to export the active simulation branch complete with updated property attributes and timestamps.

---

## Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Mapping Library:** Leaflet.js
* **Data Interchange:** GeoJSON

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
