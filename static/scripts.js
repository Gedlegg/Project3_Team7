
// ************ Gedlegoergis Geda part of JavaScript code ****************************************

// 1.Types of Products Sold and Customer Locations:
        // Product Distribution Bar Chart
        // Fetch data from SQLite database (you need to set up a backend service to serve this data)
             // Fetch data from Flask API
             function checkApiConnection() {
                d3.json('/api/product_distribution')
                    .then(function(data) {
                        // Log the fetched data to the console
                        console.log('Fetched data from /api/product_distribution:', data);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }
            
            // Call the function to check the API connection
            checkApiConnection();
              
            
            // Function to fetch and render product distribution data        
            document.addEventListener('DOMContentLoaded', function () {
                initDashboard();
            
                function initDashboard() {
                    fetch('/api/product_distribution')
                        .then(response => response.json())
                        .then(data => {
                            window.fullData = data;  // Store full data in a global variable for reuse
                            populateCountryDropdown(data);
                            populateStateDropdown(data);
                            populateYearDropdown(data);
                            updateChartsAndTables();
                        })
                        .catch(error => console.error('Error fetching data:', error));
            
                    document.getElementById('country-select').addEventListener('change', updateStatesDropdown);
                    document.getElementById('region-select').addEventListener('change', updateChartsAndTables);
                    document.getElementById('time-select').addEventListener('change', updateChartsAndTables);
                }
            
                function populateCountryDropdown(data) {
                    let uniqueCountries = Array.from(new Set(data.map(d => d.country)));
            
                    let countrySelect = document.getElementById('country-select');
                    countrySelect.innerHTML = '<option value="">All Countries</option>';
                    uniqueCountries.forEach(country => {
                        let option = document.createElement('option');
                        option.value = country;
                        option.textContent = country;
                        countrySelect.appendChild(option);
                    });
                }
            
                function updateStatesDropdown() {
                    let selectedCountry = document.getElementById('country-select').value;
                    let filteredData = selectedCountry ? window.fullData.filter(d => d.country === selectedCountry) : window.fullData;
            
                    populateStateDropdown(filteredData);
                    updateChartsAndTables();
                }
            
                function populateStateDropdown(data) {
                    let uniqueStates = Array.from(new Set(data.map(d => d.state)));
            
                    let regionSelect = document.getElementById('region-select');
                    regionSelect.innerHTML = '<option value="">All States</option>';
                    uniqueStates.forEach(state => {
                        let option = document.createElement('option');
                        option.value = state;
                        option.textContent = state;
                        regionSelect.appendChild(option);
                    });
                }
            
                function populateYearDropdown(data) {
                    let uniqueYears = Array.from(new Set(data.map(d => d.year)));
            
                    let timeSelect = document.getElementById('time-select');
                    timeSelect.innerHTML = '<option value="">All Years</option>';
                    uniqueYears.forEach(year => {
                        let option = document.createElement('option');
                        option.value = year;
                        option.textContent = year;
                        timeSelect.appendChild(option);
                    });
                }
            
                function updateChartsAndTables() {
                    let selectedCountry = document.getElementById('country-select').value;
                    let selectedRegion = document.getElementById('region-select').value;
                    let selectedYear = document.getElementById('time-select').value;
            
                    let filteredData = window.fullData.filter(d =>
                        (!selectedCountry || d.country === selectedCountry) &&
                        (!selectedRegion || d.state === selectedRegion) &&
                        (!selectedYear || d.year === selectedYear)
                    );
            
                    console.log('Filtered Data:', filteredData); // Debugging
                    renderChart(filteredData);
                    renderTables(filteredData);
                }
            
                function aggregateData(data) {
                    let aggregated = {};
            
                    data.forEach(d => {
                        let key = d.subcategory;
                        if (!aggregated[key]) {
                            aggregated[key] = {
                                subcategory: d.subcategory,
                                category: d.category,
                                total_revenue: 0
                            };
                        }
                        aggregated[key].total_revenue += parseFloat(d.total_revenue.replace(/[$,]/g, ''));
                    });
            
                    return Object.values(aggregated);
                }
            
                function getTop10Subcategories(data) {
                    let aggregatedData = aggregateData(data);
                    let top10Subcategories = aggregatedData
                        .sort((a, b) => b.total_revenue - a.total_revenue)
                        .map(d => d.subcategory);
            
                    return top10Subcategories;
                }
            
                function renderChart(data) {
                    let aggregatedData = aggregateData(data);
                    let top10Subcategories = getTop10Subcategories(data);
            
                    // Group data by category and subcategory
                    let categoryMap = {};
                    aggregatedData.forEach(d => {
                        if (!categoryMap[d.category]) {
                            categoryMap[d.category] = [];
                        }
                        categoryMap[d.category].push(d);
                    });
            
                    // Prepare traces
                    let traces = [];
                    top10Subcategories.forEach((subcategory, index) => {
                        let subcategoryData = aggregatedData.filter(d => d.subcategory === subcategory);
                        let xValues = subcategoryData.map(d => d.category);
                        let yValues = subcategoryData.map(d => d.total_revenue);
                        let textValues = subcategoryData.map(d => `Subcategory: ${d.subcategory}<br>Revenue: ${formatRevenue(d.total_revenue)}`); 
            
                        traces.push({
                            x: xValues,
                            y: yValues,
                            type: 'bar',
                            name: subcategory,
                            text: textValues,
                            hoverinfo: 'text',
                            marker: { color: getColorForSubcategory(index) }
                        });
                    });
            
                    let layout = {
                        title: 'Product Categories by Revenue',
                        barmode: 'stack',
                        xaxis: { 
                            title: 'Product Categories',
                            tickangle: -45
                        },
                        yaxis: {
                            title: 'Total Revenue',
                            tickprefix: '$',
                            tickformat: '.2s',  
                            hoverformat: '.2f'
                        },
                        margin: { b: 160 },
                        showlegend: true
                    };
            
                    Plotly.newPlot('productSalesChart', traces, layout);
                }
            
                function getColorForSubcategory(index) {
                    const colors = [
                        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
                        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
                    ];
                    return colors[index % colors.length];
                }
            
                function renderTables(data) {
                    renderTopProductsTable(data);
                    renderLossProductsTable(data);
                }
            
                function renderTopProductsTable(data) {
                    let aggregatedData = aggregateData(data);
                    let topProducts = aggregatedData.sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 5);
            
                    let topProductTable = d3.select('#topProduct');
                    topProductTable.html(''); // Clear previous content
                    topProductTable.append('h3').text('Top 5 Products by Revenue');
                    let table = topProductTable.append('table');                   
                    table.append('thead')
                        .append('tr')
                        .selectAll('th')
                        .data(['Subcategory', 'Category', 'Revenue'])
                        .enter()
                        .append('th')
                        .text(d => d);
                    let tbody = table.append('tbody');
                    tbody.selectAll('tr')
                        .data(topProducts)
                        .enter()
                        .append('tr')
                        .html(d => `<td>${d.subcategory}</td><td>${d.category}</td><td>${formatRevenue(d.total_revenue)}</td>`);
                }
            
                function renderLossProductsTable(data) {
                    let aggregatedData = aggregateData(data);
                    let lossProducts = aggregatedData.sort((a, b) => a.total_revenue - b.total_revenue).slice(0, 5);
            
                    let lossProductTable = d3.select('#lossProduct');
                    lossProductTable.html(''); // Clear previous content
                    lossProductTable.append('h3').text('Bottom 5 Products by Revenue');
                    let table = lossProductTable.append('table');
                    table.append('thead')
                        .append('tr')
                        .selectAll('th')
                        .data(['Subcategory', 'Category', 'Revenue'])
                        .enter()
                        .append('th')
                        .text(d => d);
                    let tbody = table.append('tbody');
                    tbody.selectAll('tr')
                        .data(lossProducts)
                        .enter()
                        .append('tr')
                        .html(d => `<td>${d.subcategory}</td><td>${d.category}</td><td>${formatRevenue(d.total_revenue)}</td>`);
                }   
            
                function formatRevenue(value) {
                    if (value >= 1e6) {
                        return (value / 1e6).toFixed(2) + 'M';
                    } else if (value >= 1e3) {
                        return (value / 1e3).toFixed(2) + 'K';
                    } else {
                        return value.toFixed(2);
                    }
                }
            
                function getRandomColor() {
                    let letters = '0123456789ABCDEF';
                    let color = '#';
                    for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }
            });
  

         // Customer Locations Map                   
         document.addEventListener('DOMContentLoaded', function () {
            loadCountrySelect();
            loadRegionSelect();
            loadTimeSelect();
            setupCharts();
            let customerMap = setupMap('customer-location-map');
            let heatMap = setupMap('customer-heat-map');
            setupEventListeners(customerMap, heatMap);
            customer_locations_map(customerMap);
            customer_heat_map(heatMap);
        
            // Initial display settings based on the checked radio button
            let checkedRadio = document.querySelector('input[name="mapOption"]:checked');
            if (checkedRadio) {
                if (checkedRadio.value === 'heatmap') {
                    showHeatMap();
                } else if (checkedRadio.value === 'gender') {
                    showGenderMap();
                }
            }
        });
        
        // Load Country Select Options
        function loadCountrySelect() {
            let countries = ['USA', 'Canada', 'Mexico'];
            let countrySelect = document.getElementById('country-select');
            countries.forEach(country => {
                let option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        }
        
        // Load Region Select Options
        function loadRegionSelect() {
            let regions = ['California', 'New York', 'Texas'];
            let regionSelect = document.getElementById('region-select');
            regions.forEach(region => {
                let option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
        }
        
        // Load Time Select Options
        function loadTimeSelect() {
            let years = ['2020', '2021', '2022'];
            let timeSelect = document.getElementById('time-select');
            years.forEach(year => {
                let option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                timeSelect.appendChild(option);
            });
        }
        
        // Map Setup
        function setupMap(containerId) {
            let mapContainer = document.getElementById(containerId);
            if (!mapContainer) {
                console.error(`Map container with ID ${containerId} not found`);
                return;
            }
        
            // Initialize the map
            let map = L.map(containerId).setView([0, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        
            return map;
        }
        
        // Charts Setup
        let pieChart;
        
        function setupCharts() {
            let ctx = document.getElementById('pieChart').getContext('2d');
            pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Male', 'Female'],
                    datasets: [{
                        data: [60, 40],
                        backgroundColor: ['#1064b3', '#b94496']
                    }]
                },
                options: {
                    legend: {
                        display: true
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let label = data.labels[tooltipItem.index];
                                let value = data.datasets[0].data[tooltipItem.index];
                                return `${label}: ${value.toFixed(1)}%`;
                            }
                        }
                    }
                }
            });
        }
        
        // Event Listeners Setup
        function setupEventListeners(customerMap, heatMap) {
            let mapOptionRadios = Array.from(document.getElementsByName('mapOption'));
        
            mapOptionRadios.forEach(radio => {
                radio.addEventListener('change', function () {
                    if (this.value === 'heatmap') {
                        showHeatMap();
                    } else if (this.value === 'gender') {
                        showGenderMap();
                    }
                });
            });
        
            let countrySelect = document.getElementById('country-select');
            countrySelect.addEventListener('change', function () {
                updateMapAndChart(this.value, customerMap);
            });
        }
        
        function showHeatMap() {
            let heatMapContainer = document.getElementById('heat-map-container');
            let mapContainer = document.getElementById('map-container');
            let pieContainer = document.getElementById('pie-container');
        
            heatMapContainer.style.display = 'block';
            mapContainer.style.display = 'none';
            pieContainer.style.display = 'none';
        }
        
        function showGenderMap() {
            let heatMapContainer = document.getElementById('heat-map-container');
            let mapContainer = document.getElementById('map-container');
            let pieContainer = document.getElementById('pie-container');
        
            heatMapContainer.style.display = 'none';
            mapContainer.style.display = 'block';
            pieContainer.style.display = 'block';
        }
        
        // Update Map and Chart based on Country Selection
        function updateMapAndChart(country, map) {
            // Remove existing layers
            map.eachLayer(layer => {
                if (layer instanceof L.Marker || layer instanceof L.LayerGroup) {
                    map.removeLayer(layer);
                }
            });
        
            // Add new markers
            let newMarkers = [
                { lat: 37.7749, lng: -122.4194, gender: 'male' },
                { lat: 34.0522, lng: -118.2437, gender: 'female' }
            ];
        
            let icons = {
                male: L.ExtraMarkers.icon({
                    icon: "ion-man",
                    iconColor: "white",
                    markerColor: "blue",
                    shape: "circle"
                }),
                female: L.ExtraMarkers.icon({
                    icon: "ion-woman",
                    iconColor: "white",
                    markerColor: "pink",
                    shape: "circle"
                })
            };
        
            let maleCount = 0;
            let femaleCount = 0;
        
            newMarkers.forEach(markerData => {
                let marker = L.marker([markerData.lat, markerData.lng], {
                    icon: markerData.gender.toLowerCase() === 'male' ? icons.male : icons.female
                }).addTo(map);
        
                if (markerData.gender.toLowerCase() === 'male') {
                    maleCount++;
                } else {
                    femaleCount++;
                }
            });
        
            let totalCount = maleCount + femaleCount;
            let malePercentage = (maleCount / totalCount) * 100;
            let femalePercentage = (femaleCount / totalCount) * 100;
        
            pieChart.data.datasets[0].data = [malePercentage, femalePercentage];
            pieChart.update();
        }
        
        // Customer Locations cluster Map
        function customer_heat_map(map) {
            d3.json('/api/customer_locations_cluster')
                .then(function (data) {
                    let clusterMarkers = L.markerClusterGroup();
                    data.forEach(location => {
                        if (location) {
                            clusterMarkers.addLayer(L.marker([
                                location.latitude, location.longitude
                            ]));
                        }
                    });
        
                    map.addLayer(clusterMarkers);
                })
                .catch(error => console.error('Error fetching cluster data:', error));
        }
        
        // Customer Locations Map
        function customer_locations_map(map) {
            fetch('/api/customer_locations')
                .then(response => response.json())
                .then(data => {
                    let countries = ["Australia", "Canada", "Germany", "France", "Italy", "Netherlands", "United Kingdom", "United States"];
                    let continents = ["Australia", "North America", "Europe"];
        
                    let countryCoordinates = {
                        "Australia": { lat: -23.69748, lng: 133.88362, zoom: 3.4 },
                        "Canada": { lat: 56.1304, lng: -106.3468, zoom: 3 },
                        "Germany": { lat: 51.1657, lng: 10.4515, zoom: 5 },
                        "France": { lat: 46.2276, lng: 2.2137, zoom: 5 },
                        "Italy": { lat: 41.8719, lng: 12.5674, zoom: 5 },
                        "Netherlands": { lat: 52.3702, lng: 4.8951, zoom: 7 },
                        "United Kingdom": { lat: 55.3781, lng: -3.4360, zoom: 4.5 },
                        "United States": { lat: 37.0902, lng: -95.7128, zoom: 3 }
                    };
        
                    let continentCoordinates = {
                        "Australia": { lat: -23.69748, lng: 133.88362, zoom: 3.4 },
                        "North America": { lat: 47.1428, lng: -99.7812, zoom: 2 },
                        "Europe": { lat: 46.2022, lng: 1.2644, zoom: 3.4 }
                    };
        
                    let icons = {
                        male: L.ExtraMarkers.icon({
                            icon: "ion-man",
                            iconColor: "white",
                            markerColor: "blue",
                            shape: "circle"
                        }),
                        female: L.ExtraMarkers.icon({
                            icon: "ion-woman",
                            iconColor: "white",
                            markerColor: "pink",
                            shape: "circle"
                        })
                    };
        
                    let countryLayers = {};
                    let continentLayers = {};
        
                    countries.forEach(country => {
                        countryLayers[country] = L.layerGroup();
                    });
        
                    continents.forEach(continent => {
                        continentLayers[continent] = L.layerGroup();
                    });
        
                    data.forEach(location => {
                        let popupText = `${location.city}, ${location.state}, ${location.country}`;
                        let marker = L.marker([location.latitude, location.longitude], {
                            icon: location.gender.toLowerCase() === 'male' ? icons.male : icons.female
                        }).bindPopup(popupText);
        
                        countryLayers[location.country].addLayer(marker);
                        continentLayers[location.continent].addLayer(marker);
                    });
                    function renderPieChart(data) {
                        let maleCount = data.filter(location => location.gender.toLowerCase() === 'male').length;
                        let femaleCount = data.filter(location => location.gender.toLowerCase() === 'female').length;
                        let totalCount = maleCount + femaleCount;
        
                        let malePercentage = (maleCount / totalCount) * 100;
                        let femalePercentage = (femaleCount / totalCount) * 100;
        
                        pieChart.data.datasets[0].data = [malePercentage, femalePercentage];
                        pieChart.update(); 
                        // Clear existing pie chart if it exists
                        d3.select("#pieChart").selectAll("*").remove();
        
                        let svg = d3.select("#pieChart")
                                    .append("svg")
                                    .attr("width", 300)
                                    .attr("height", 300)
                                    .append("g")
                                    .attr("transform", "translate(150, 150)");
        
                        let dataPie = [
                            { label: "Male", value: malePercentage },
                            { label: "Female", value: femalePercentage }
                        ];
        
                        let color = d3.scaleOrdinal(["#1064b3", "#b94496"]);
        
                        let pie = d3.pie()
                                    .value(d => d.value);
        
                        let arc = d3.arc()
                                    .innerRadius(0)
                                    .outerRadius(100);
        
                        let arcs = svg.selectAll(".arc")
                                    .data(pie(dataPie))
                                    .enter()
                                    .append("g")
                                    .attr("class", "arc");
        
                        arcs.append("path")
                            .attr("d", arc)
                            .attr("fill", d => color(d.data.label));
        
                        arcs.append("text")
                            .attr("transform", d => `translate(${arc.centroid(d)})`)
                            .attr("text-anchor", "middle")
                            .text(d => `${d.data.label} (${d.data.value.toFixed(1)}%)`);
        
                        // Create and style legend
                        let legendContainer = document.querySelector('.legend-container');
                        if (!legendContainer) {
                            legendContainer = L.DomUtil.create('div', 'legend-container');
                            map.getContainer().appendChild(legendContainer);
                        }
                        legendContainer.innerHTML = `
                            <div class="legend">
                                <h4>Gender Distribution</h4>
                                <div>
                                    <span class="legend-color male"></span>
                                    <span>Male (${malePercentage.toFixed(1)}%)</span>
                                </div>
                                <div>
                                    <span class="legend-color female"></span>
                                    <span>Female (${femalePercentage.toFixed(1)}%)</span>
                                </div>
                            </div>
                        `;
                        legendContainer.style.position = 'absolute';
                        legendContainer.style.bottom = '20px';
                        legendContainer.style.right = '20px';
                        legendContainer.style.zIndex = '1000';  // Ensure it's on top of the map
                        legendContainer.style.width = '200px';
                        legendContainer.style.padding = '10px';
                        legendContainer.style.backgroundColor = 'white';
                        legendContainer.style.border = '1px solid #ccc';
                        legendContainer.style.borderRadius = '8px';
                        legendContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                    }
        
                    renderPieChart(data);
        
                    let select = L.DomUtil.create('select', 'layer-control');
                    select.innerHTML = `
                        <option value="">Select a country or continent</option>
                        <optgroup label="Countries">
                            ${countries.map(country => `<option value="${country}">${country}</option>`).join('')}
                        </optgroup>
                        <optgroup label="Continents">
                            ${continents.map(continent => `<option value="${continent}">${continent}</option>`).join('')}
                        </optgroup>
                    `;
        
                    L.DomEvent.on(select, 'change', function(e) {
                        let value = e.target.value;
                        let filteredData;
                        map.eachLayer(layer => {
                            if (layer instanceof L.Marker || layer instanceof L.LayerGroup) {
                                map.removeLayer(layer);
                            }
                        });
        
                        if (value) {
                            if (countries.includes(value)) {
                                filteredData = data.filter(location => location.country === value);
                                countryLayers[value].addTo(map);
                                let coords = countryCoordinates[value];
                                map.setView([coords.lat, coords.lng], coords.zoom);
                                if (geoJsonUrls[value]) {
                                    addBoundaries(geoJsonUrls[value], map);
                                }
                            } else if (continents.includes(value)) {
                                filteredData = data.filter(location => location.continent === value);
                                continentLayers[value].addTo(map);
                                let coords = continentCoordinates[value];
                                map.setView([coords.lat, coords.lng], coords.zoom);
                                if (geoJsonUrls[value]) {
                                    addBoundaries(geoJsonUrls[value], map);
                                }
                            }
                            renderPieChart(filteredData);
                        } else {
                            renderPieChart(data);
                        }
                    });
        
                    function addBoundaries(url, map) {
                        fetch(url)
                            .then(response => response.json())
                            .then(geoJsonData => {
                                L.geoJSON(geoJsonData, {
                                    style: {
                                        color: 'blue',
                                        weight: 2
                                    }
                                }).addTo(map);
                            })
                            .catch(error => console.error('Error loading GeoJSON:', error));
                    }
        
                    let geoJsonUrls = {
                        "Australia": "path/to/australia_boundary.geojson",
                        "North America": "path/to/north_america_boundary.geojson",
                        "Europe": "path/to/europe_boundary.geojson",
                        "Canada": "path/to/canada_boundary.geojson",
                        "Germany": "path/to/germany_boundary.geojson",
                        "France": "path/to/france_boundary.geojson",
                        "Italy": "path/to/italy_boundary.geojson",
                        "Netherlands": "path/to/netherlands_boundary.geojson",
                        "United Kingdom": "path/to/uk_boundary.geojson",
                        "United States": "path/to/usa_boundary.geojson"
                    };
        
                    let controlContainer = L.DomUtil.create('div', 'control-container');
                    controlContainer.appendChild(select);
                    map.getContainer().appendChild(controlContainer);
        
                    L.control.layers(null, null, { collapsed: false }).addTo(map);
                    
                })
                .catch(error => console.error('Error fetching customer data:', error));
        }
        
        
   
        // Stacked Bar Chart for Product Types and Regions
        document.addEventListener('DOMContentLoaded', function () {
            let fullData; // Global variable to store fetched data

            initDashboard();

            function initDashboard() {
                fetch('/api/store_location')
                    .then(response => response.json())
                    .then(data => {
                        fullData = data; // Store fetched data in the global variable
                        console.log('Fetched Data:', fullData); // Debugging
                        populateCountryDropdown(fullData);
                        populateYearDropdown(fullData); // Moved to ensure it gets called
                        renderChart(fullData);
                        renderTables(fullData);
                    })
                    .catch(error => console.error('Error fetching data:', error));

                document.getElementById('store-country-select').addEventListener('change', updateCharts);
                document.getElementById('store-time-select').addEventListener('change', updateCharts);
            }

            function populateCountryDropdown(data) {
                let uniqueCountries = Array.from(new Set(data.map(d => d.country)));
                let countrySelect = d3.select('#store-country-select');
                countrySelect.html('<option value="">All Countries</option>');
                uniqueCountries.forEach(country => {
                    countrySelect.append('option')
                        .attr('value', country)
                        .text(country);
                });
            }

            function populateYearDropdown(data) {
                let uniqueYears = Array.from(new Set(data.map(d => d.year)));
                let timeSelect = d3.select('#store-time-select');
                timeSelect.html('<option value="">All Years</option>');
                uniqueYears.forEach(year => {
                    timeSelect.append('option')
                        .attr('value', year)
                        .text(year);
                });
            }

            function updateCharts() {
                let selectedCountry = d3.select('#store-country-select').property('value');
                let selectedYear = d3.select('#store-time-select').property('value');

                let filteredData = fullData.filter(d =>
                    (!selectedCountry || d.country === selectedCountry) &&
                    (!selectedYear || d.year === selectedYear)
                );

                console.log('Filtered Data:', filteredData); // Debugging
                renderChart(filteredData);
                renderTables(filteredData);
            }
            let (d.total_revenue) = formatRevenue(d.total_revenue)
            function renderChart(data) {
                // Implement your chart rendering logic here using D3 or Plotly
                let states = Array.from(new Set(data.map(d => d.state)));
                let traceData = states.map(state => {
                    let stateData = data.filter(d => d.state === state);
                    let xValues = stateData.map(d => d.country);
                    let yValues = stateData.map(d => parseFloat(d.total_revenue.replace(/[$,]/g, '')));

                    return {
                        x: xValues,
                        y: yValues,
                        type: 'bar',
                        name: state,
                        text: stateData.map(d => `State: ${d.state}<br>Cost: ${d.total_cost}<br>Revenue: ${d.total_revenue}<br>Profit: ${d.profit}`),
                        hoverinfo: 'text',
                        marker: { color: getRandomColor() }
                    };
                });

                let layout = {
                    title: 'Top Stores by Revenue',
                    barmode: 'stack',
                    xaxis: { title: 'Country', tickangle: -45 },
                    yaxis: {
                        title: 'Total Revenue',
                        tickprefix: '$',
                        tickformat: '.2s',  
                        hoverformat: '.2f'
                    }
                };

                Plotly.newPlot('stackedBarChart', traceData, layout);
            }

            function renderTables(data) {
                renderTopStoresTable(data);
                renderLossStoresTable(data);
            }

            function renderTopStoresTable(data) {
                let topStores = data.sort((a, b) => parseFloat(b.total_revenue.replace(/[$,]/g, '')) - parseFloat(a.total_revenue.replace(/[$,]/g, '')))
                    .slice(0, 5);

                let topStoreTable = d3.select('#topStore');
                topStoreTable.html(''); // Clear previous content
                topStoreTable.append('h3').text('Top 5 Stores by Revenue');
                let table = topStoreTable.append('table');
                table.append('thead')
                    .append('tr')
                    .selectAll('th')
                    .data(['State', 'Country', 'Revenue'])
                    .enter()
                    .append('th')
                    .text(d => d);
                let tbody = table.append('tbody');
                tbody.selectAll('tr')
                    .data(topStores)
                    .enter()
                    .append('tr')
                    .html(d => `<td>${d.state}</td><td>${d.country}</td><td>${d.total_revenue}</td>`);
            }

            function renderLossStoresTable(data) {
                let lossStores = data.sort((a, b) => parseFloat(a.total_revenue.replace(/[$,]/g, '')) - parseFloat(b.total_revenue.replace(/[$,]/g, '')))
                    .slice(0, 5);

                let lossStoreTable = d3.select('#lossStore');
                lossStoreTable.html(''); // Clear previous content
                lossStoreTable.append('h3').text('Bottom 5 Stores by Revenue');
                let table = lossStoreTable.append('table');
                table.append('thead')
                    .append('tr')
                    .selectAll('th')
                    .data(['State', 'Country', 'Revenue'])
                    .enter()
                    .append('th')
                    .text(d => d);
                let tbody = table.append('tbody');
                tbody.selectAll('tr')
                    .data(lossStores)
                    .enter()
                    .append('tr')
                    .html(d => `<td>${d.state}</td><td>${d.country}</td><td>${d.total_revenue}</td>`);
            }

            function formatRevenue(value) {
                if (value >= 1e6) {
                    return (value / 1e6).toFixed(2) + 'M';
                } else if (value >= 1e3) {
                    return (value / 1e3).toFixed(2) + 'K';
                } else {
                    return value.toFixed(2);
                }
            }

            function getRandomColor() {
                let letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
        });
        
      
// ************ WIlly ****************************************
// 2. Seasonal Patterns or Trends for Order Volume or Revenue:
    
// Line Chart for Monthly Order Volume and Revenue
fetch('/api/monthly_order_revenue')
    .then(response => response.json())
    .then(data => {
        let months = data.map(item => `${item.year}-${item.month}`);
        let orderCounts = data.map(item => item.order_count);
        let revenues = data.map(item => item.revenue);

        let orderTrace = {
            x: months,
            y: orderCounts,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Order Volume',
            marker: { color: 'blue' }
        };

        let revenueTrace = {
            x: months,
            y: revenues,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Revenue',
            marker: { color: 'green' }
        };

        let layout = {
            title: 'Order Volume and Revenue Distribution by Year',
            xaxis: { title: 'Year' },
            yaxis: { title: 'Order Volume / Revenue', color: 'gray' }
        };

        Plotly.newPlot('monthlyOrderRevenueLineChart', [orderTrace, revenueTrace], layout);
    })
    .catch(error => console.error('Error fetching and plotting data:', error));

// Line Chart for Monthly Order Volume
fetch('/api/monthly_order_volume')
    .then(response => response.json())
    .then(data => {
        let trace = {
            x: data.months,
            y: data.order_counts,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
            name: 'Order Volume'
        };

        let layout = {
            title: 'Order Volume Distribution by Year',
            xaxis: { title: 'Year' },
            yaxis: { title: 'Order Volume', color: 'gray' }
        };

        Plotly.newPlot('monthlyOrderVolumeLineChart', [trace], layout);
    })
    .catch(error => console.error('Error fetching and plotting data:', error));

// Line Chart for Monthly Revenue
fetch('/api/monthly_revenue')
    .then(response => response.json())
    .then(data => {
        let trace = {
            x: data.months,
            y: data.revenues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'green' },
            name: 'Revenue'
        };

        let layout = {
            title: 'Revenue Distribution by Year',
            xaxis: { title: 'Year' },
            yaxis: { title: 'Revenue', color: 'gray' }
        };

        Plotly.newPlot('monthlyRevenueLineChart', [trace], layout);
    })
    .catch(error => console.error('Error fetching and plotting data:', error));

// Heatmap for Monthly Order Volume by Year and Month
fetch('/api/seasonal_order_distribution')
    .then(response => response.json())
    .then(data => {
        let years = Array.from(new Set(data.map(item => item.year)));
        let seasons = ['Winter', 'Spring', 'Summer', 'Fall']; // Define the seasons

        // Prepare the z array for the heatmap
        let z = [];

        years.forEach(year => {
            let row = [];
            seasons.forEach(season => {
                let entry = data.find(item => item.year === year && item.season === season);
                row.push(entry ? entry.order_count : 0);
            });
            z.push(row);
        });

        let trace = {
            x: seasons,
            y: years,
            z: z,
            type: 'heatmap',
            colorscale: [
                [0, 'green'],
                [0.5, 'yellow'],
                [1, 'red']
            ],
            colorbar: {
                title: 'Order Volume'
            }
        };

        let layout = {
            title: 'Seasonal Order Volume Distribution by Year',
            xaxis: { title: 'Season', color: 'gray' },
            yaxis: { title: 'Year', color: 'gray' }
        };

        Plotly.newPlot('monthlyOrderHeatmap', [trace], layout);
    })
    .catch(error => console.error('Error fetching and plotting data:', error));


// Heatmap for Monthly Revenue by Year and Month
fetch('/api/seasonal_revenue_distribution')
    .then(response => response.json())
    .then(data => {
        let years = Array.from(new Set(data.map(item => item.year)));
        let seasons = ['Winter', 'Spring', 'Summer', 'Fall']; // Define the seasons

        // Prepare the z array for the heatmap
        let z = [];

        years.forEach(year => {
            let row = [];
            seasons.forEach(season => {
                let entry = data.find(item => item.year === year && item.season === season);
                row.push(entry ? entry.revenue : 0);
            });
            z.push(row);
        });

        let trace = {
            x: seasons,
            y: years,
            z: z,
            type: 'heatmap',
            colorscale: [
                [0, 'green'],
                [0.5, 'yellow'],
                [1, 'red']
            ],
            colorbar: {
                title: 'Revenue'
            }
        };

        let layout = {
            title: 'Seasonal Revenue Distribution by Year',
            xaxis: { title: 'Season', color: 'gray' },
            yaxis: { title: 'Year', color: 'gray' }
        };

        Plotly.newPlot('monthlyRevenueHeatmap', [trace], layout);
    })
    .catch(error => console.error('Error fetching and plotting data:', error));


// Box Plot for Order Volumes by Season or Month
// Function to fetch available years and populate the year selector
document.addEventListener('DOMContentLoaded', function() {
    populateYearSelector();
});

let allData = {};

function populateYearSelector() {
    fetch('/api/available_years')
        .then(response => response.json())
        .then(years => {
            let yearSelector = document.getElementById('yearSelector');
            yearSelector.innerHTML = ''; // Clear existing options
            years.forEach(year => {
                let option = document.createElement('option');
                option.value = year;
                option.text = year;
                yearSelector.appendChild(option);
            });

            // Fetch all data and display for the first year by default
            fetchAllData(years[0]);
        })
        .catch(error => console.error('Error fetching years:', error));
}

function fetchAllData(initialYear) {
    fetch('/api/yearly_order_distribution')
        .then(response => response.json())
        .then(data => {
            allData = data;
            // Display data for the initial year
            updateCharts(initialYear);
        })
        .catch(error => console.error('Error fetching all data:', error));
}

function updateCharts(year) {
    let yearData = allData[year];
    let months = Object.keys(yearData);
    let traces = months.map(month => {
        let days = Object.keys(yearData[month]).map(day => yearData[month][day]);
        return {
            y: days,
            type: 'box',
            name: new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' })
        };
    });

    let layout = {
        title: `Trend of Order Volume Distribution for ${year}`,
        xaxis: { title: 'Month' },
        yaxis: { title: 'Order Volum', color: 'gray'}
    };

    Plotly.newPlot('seasonalOrderBoxPlot', traces, layout);
}

document.getElementById('yearSelector').addEventListener('change', function() {
    let selectedYear = this.value;
    updateCharts(selectedYear);
});




// Box Plot for Revenues by Season or Month
document.addEventListener('DOMContentLoaded', function() {
    populateYearSelector();
});

let allOrderData = {};
let allRevenueData = {};

function populateYearSelector() {
    fetch('/api/available_years')
        .then(response => response.json())
        .then(years => {
            let yearSelector = document.getElementById('yearSelector');
            yearSelector.innerHTML = ''; // Clear existing options
            years.forEach(year => {
                let option = document.createElement('option');
                option.value = year;
                option.text = year;
                yearSelector.appendChild(option);
            });

            // Fetch all data and display for the first year by default
            if (years.length > 0) {
                fetchAllData(years[0]);
            }
        })
        .catch(error => console.error('Error fetching years:', error));
}

function fetchAllData(initialYear) {
    fetch('/api/yearly_order_distribution')
        .then(response => response.json())
        .then(data => {
            allOrderData = data;
            // Display data for the initial year
            updateOrderChart(initialYear);
        })
        .catch(error => console.error('Error fetching order data:', error));

    fetch('/api/yearly_revenue_distribution')
        .then(response => response.json())
        .then(data => {
            allRevenueData = data;
            // Display data for the initial year
            updateRevenueChart(initialYear);
        })
        .catch(error => console.error('Error fetching revenue data:', error));
}

function updateOrderChart(year) {
    let yearData = allOrderData[year];
    let months = Object.keys(yearData);
    let traces = months.map(month => {
        let days = Object.keys(yearData[month]).map(day => yearData[month][day]);
        return {
            y: days,
            type: 'box',
            name: new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' })
        };
    });

    let layout = {
        title: `Trend of Order Volume Distribution for ${year}`,
        xaxis: { title: 'Month' },
        yaxis: { title: 'Order Volume', color: 'gray'}
    };

    Plotly.newPlot('seasonalOrderBoxPlot', traces, layout);
}

function updateRevenueChart(year) {
    let yearData = allRevenueData[year];
    let months = Object.keys(yearData);
    let traces = months.map(month => {
        let days = Object.keys(yearData[month]).map(day => yearData[month][day]);
        return {
            y: days,
            type: 'box',
            name: new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' })
        };
    });

    let layout = {
        title: `Tend of Revenue Distribution for ${year}`,
        xaxis: { title: 'Month' },
        yaxis: { title: 'Revenue', color: 'gray' }
    };

    Plotly.newPlot('seasonalRevenueBoxPlot', traces, layout);
}

document.getElementById('yearSelector').addEventListener('change', function() {
    let selectedYear = this.value;
    updateOrderChart(selectedYear);
    updateRevenueChart(selectedYear);
});



// 3. Average Delivery Time in Days Over Time:
        // Line Chart for Average Delivery Time

    // Function to calculate average and round to 2 decimal places
    function CalculateAverage(sample_array) {
        let sum = sample_array.reduce ((i,j) => i+j, 0);
        let average = sum/sample_array.length;
        return parseFloat(average.toFixed(2));
    }
    
    // Function to calculate the linear regression
    function linearRegression(x, y) {
        let n = x.length;
        let xMean = x.reduce((a, b) => a + b) / n;
        let yMean = y.reduce((a, b) => a + b) / n;

        let num = 0;
        let den = 0;
        for (let i = 0; i < n; i++) {
            num += (x[i] - xMean) * (y[i] - yMean);
            den += (x[i] - xMean) ** 2;
        }

        let slope = num / den;
        let intercept = yMean - slope * xMean;

        return { slope, intercept };
    }
    // Function to update the plot
    function UpdatePlot(data, CurrencyCode){
        let SelData = CurrencyCode == "All Regions" ? data : data.filter(i => i.Currency == CurrencyCode); // Filter data by selected region if it's not "All Regions"

        let monthly_data = {}; // Initiating an object that will hold months as keys and all the delivery times (in an array) as values

        SelData.forEach(entry => {
        let month = entry.Order_month;
        if (!monthly_data[month]) {
            monthly_data[month] = [];                    
        }
        monthly_data[month].push(entry.Delivery_time);            
        });            
                
        let Average_monthly_data = {}; // Initiating an object that will hold months as keys and the corresponding average delivery times as values
        Object.entries(monthly_data).forEach(([month, deliverytime]) => {
        Average_monthly_data[month] = CalculateAverage(deliverytime);
        });

        // Preparing data for line plot and regression line

        let months = Object.keys(Average_monthly_data);
        let AvgDeliveryTimes = Object.values(Average_monthly_data);

        let monthNums = months.map((month, index) => index); // Convert month strings to numerical values for regression calculation

        // Calculate the regression line
        let { slope, intercept } = linearRegression(monthNums, AvgDeliveryTimes);

        // Calculate the y-values of the regression line
        let regressionY = monthNums.map(x => slope * x + intercept);

        // Trace for the line plot
        let trace1 = {
        x: months,
        y: AvgDeliveryTimes,
        mode: "lines+markers", 
        name: 'Average Delivery Time'                            
        };

        // Trace for the regression line
        let trace2 = {
            x: months,
            y: regressionY,
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'red'},
            line: { dash: 'dash' },
            name: 'Trend Line'
        };

        // Definining the layout
        let layout1 = {
        title: "Monthly Average Delivery Times",
        xaxis: {title: "Month of order", type: "date", tickformat: "%Y-%m"},
        yaxis: {title: "Average Delivery time (in days)", rangemode: "tozero"}
        };                 
        
        // Rendering the plots
    Plotly.newPlot("avg-delivery-line-chart", [trace1, trace2], layout1);

    }

    d3.json('api/average_delivery_time').then(data => {
        
        UpdatePlot(data, "All Regions");
        d3.selectAll("#SelectRegion").on("change", function() {

            let SelOption = d3.select(this);
            let SelCurrencyCode = SelOption.property("value");
                        
            UpdatePlot(data, SelCurrencyCode);
        });
        
    });

        //Bar Chart for Product-wise Delivery Times
        let fullData = [];

        // Fetch data from the API once and store it
        d3.json('http://127.0.0.1:5000/api/product_wise_delivery_time').then(data => {
            
            fullData = data;
        
            // Initial plot with top 10 products
            updateChart('Top', 10);
        })
        
        // Function to show suggestions
        function showSuggestions(input) {
            let suggestions = document.getElementById('suggestions');
            suggestions.innerHTML = '';
            if (!input) return;
        
            let filteredProducts = fullData
                .map(d => d.Product_name)
                .filter(name => name.toLowerCase().includes(input.toLowerCase()))        
        
            filteredProducts.forEach(product => {
                let suggestionDiv = document.createElement('div');
                suggestionDiv.textContent = product;
                suggestionDiv.onclick = () => selectProduct(product);
                suggestions.appendChild(suggestionDiv);
            });
        }
        
        function selectProduct(product) {
            document.getElementById('product-input').value = product;
            document.getElementById('suggestions').innerHTML = '';
            highlightProduct();
        }
        
        // Function to create the bar chart
        function createBarChart(data, title, highlightProduct = null) {
            let productNames = data.map(d => d.Product_name);
            let deliveryTimes = data.map(d => d.Avg_Delivery_times);
        
            let maxTime = Math.max(...deliveryTimes);
            let minTime = Math.min(...deliveryTimes);
        
            let colors = highlightProduct ? 
                productNames.map(name => name === highlightProduct ? 'red' : 'lightgray') : 
                deliveryTimes;
            
            let trace3 = {
                x: deliveryTimes,
                y: productNames,
                type: 'bar',
                orientation: 'h',
                marker: {
                    color: colors,
                    colorscale: highlightProduct ? null : 'Viridis',
                    cmin: highlightProduct ? null : minTime,
                    cmax: highlightProduct ? null : maxTime,
                    colorbar: highlightProduct ? null : {
                        title: 'Delivery Times (in Days)'
                    }
                }
            };
        
            let layout2 = {
                title: title,
                xaxis: {
                    title: 'Average Delivery Time (Days)'
                },
                yaxis: {
                    title: 'Product Name',
                    autorange: 'reversed'
                }
            };
        
            Plotly.newPlot('product-wise-chart', [trace3], layout2);
        }
        
        // Function to update the chart based on user selection
        function updateChart(type, count) {
        
            let sortedData = fullData.sort((a, b) => b.Avg_Delivery_times - a.Avg_Delivery_times);
            
            let slicedData = type === 'Top' ? sortedData.slice(0, count) : sortedData.slice(-count);
            createBarChart(slicedData, type === 'Top' ? `${count} Products with Longest Delivery Time` : `${count} Products with Shortest Delivery Time`);
        }
        
        // Function to highlight the selected product
        function highlightProduct() {
            let productInput = document.getElementById('product-input').value.toLowerCase();
            let sortedData = fullData.sort((a, b) => b.Avg_Delivery_times - a.Avg_Delivery_times);
        
            let productIndex = sortedData.findIndex(d => d.Product_name.toLowerCase() === productInput);
            
            if (productIndex === -1) {
                console.error('Product not found.');
                return;
            }
        
            let startIndex = Math.max(productIndex - 5, 0);
            let endIndex = Math.min(productIndex + 6, sortedData.length);
        
            let slicedData = sortedData.slice(startIndex, endIndex);
            createBarChart(slicedData, `Average Delivery Time for ${sortedData[productIndex].Product_name} is ${sortedData[productIndex].Avg_Delivery_times} Days!`, sortedData[productIndex].Product_name);
        }
        // Scatter Plot for Delivery Times Over Time

// 4. Difference in Average Order Value (AOV) for Online vs. In-Store Sales:
        // Box Plot for AOV Comparison
        document.addEventListener('DOMContentLoaded', function() {
            populateBoxPlotYearSelector(); // Populate the year selector for box plot
        });
        
        function populateBoxPlotYearSelector() {
            fetch('/api/available_years')
                .then(response => response.json())
                .then(years => {
                    let boxPlotYearSelector = document.getElementById('boxPlotYearSelector');
                    boxPlotYearSelector.innerHTML = ''; // Clear existing options
                    years.forEach(year => {
                        let option = document.createElement('option');
                        option.value = year;
                        option.textContent = year; // Use textContent to set the visible text
                        boxPlotYearSelector.appendChild(option);
                    });
        
                    // Fetch data for the initial year by default
                    if (years.length > 0) {
                        fetchDataForBoxPlotYear(years[0]); // Fetch data for the default year
                    }
                })
                .catch(error => console.error('Error fetching years:', error));
        }
        
        function fetchDataForBoxPlotYear(year) {
            fetch(`/api/aov_comparison_count/${year}`)
                .then(response => response.json())
                .then(data => {
                    updateBoxPlot(data);
                })
                .catch(error => console.error('Error fetching order data:', error));
        }
        
        function updateBoxPlot(data) {
            let trace1 = {
                y: data.in_store,
                type: 'box',
                name: 'In-Store'
            };
        
            let trace2 = {
                y: data.online,
                type: 'box',
                name: 'Online'
            };
        
            let layout = {
                title: 'Average Order Volume by Sales Channel',
                yaxis: {
                    title: 'Order Volume',
                    color: 'gray'
                },
                xaxis: {
                    title: 'Sales Channel'
                }
            };
        
            let plotData = [trace1, trace2];
            Plotly.newPlot('aovBoxPlot', plotData, layout);
        }
        
        document.getElementById('boxPlotYearSelector').addEventListener('change', function() {
            let selectedYear = this.value;
            fetchDataForBoxPlotYear(selectedYear);
        });
          
    
    
    

        // Bar Chart for AOV Comparison
        document.addEventListener('DOMContentLoaded', function () {
            fetch('/api/aov_comparison_revenue')
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    let years = data.years;
                    let onlineData = data.online;
                    let inStoreData = data.in_store;
        
                    let trace1 = {
                        x: years,
                        y: inStoreData,
                        type: 'bar',
                        name: 'In-Store',
                        marker: { color: 'rgba(55, 128, 191, 0.7)' }
                    };
        
                    let trace2 = {
                        x: years,
                        y: onlineData,
                        type: 'bar',
                        name: 'Online',
                        marker: { color: 'rgba(219, 64, 82, 0.7)' }
                    };
        
                    let layout = {
                        title: 'Seasonal Revenue Distribution by Sales Channel Comparison',
                        xaxis: { title: 'Year' },
                        yaxis: { title: 'Total Revenue', color: 'gray'},
                        barmode: 'group'
                    };
        
                    let chartData = [trace1, trace2];
                    Plotly.newPlot('aovBarChart', chartData, layout);
                })
                .catch(error => {
                    console.error('Error fetching and plotting data:', error);
                });
        });
      
        
      // Violin Plot for AOV Comparison
        document.addEventListener('DOMContentLoaded', function() {
            populateViolinPlotYearSelector(); // Populate the year selector for violin plot
        });
        
        function populateViolinPlotYearSelector() {
            fetch('/api/available_years')
                .then(response => response.json())
                .then(years => {
                    let violinPlotYearSelector = document.getElementById('boxPlotYearSelector');
                    violinPlotYearSelector.innerHTML = ''; // Clear existing options
                    years.forEach(year => {
                        let option = document.createElement('option');
                        option.value = year;
                        option.textContent = year; // Use textContent to set the visible text
                        violinPlotYearSelector.appendChild(option);
                    });
        
                    // Fetch data for the initial year by default
                    if (years.length > 0) {
                        fetchDataForViolinPlotYear(years[0]); // Fetch data for the default year
                    }
                })
                .catch(error => console.error('Error fetching years:', error));
        }
        
        function fetchDataForViolinPlotYear(year) {
            fetch(`/api/aov_violin_comparison/${year}`)
                .then(response => response.json())
                .then(data => {
                    updateViolinPlot(data);
                })
                .catch(error => console.error('Error fetching revenue data:', error));
        }
        
        function updateViolinPlot(data) {
            let plotData = [
                {
                    y: data.in_store,
                    type: 'violin',
                    name: 'In-Store',
                    marker: { color: 'rgba(0, 123, 255, 0.5)' }, // Blue color
                    box: { visible: true },
                    meanline: { visible: true },
                    line: { color: 'rgba(0, 123, 255, 1)' }, // Blue color
                    hoverinfo: 'y', // Shows only the y value
                    hovertext: data.in_store.map(value => `Revenue: $${value}`) // Custom hover text
                },
                {
                    y: data.online,
                    type: 'violin',
                    name: 'Online',
                    marker: { color: 'rgba(255, 165, 0, 0.5)' }, // Orange color
                    box: { visible: true },
                    meanline: { visible: true },
                    line: { color: 'rgba(255, 165, 0, 1)' }, // Orange color
                    hoverinfo: 'y', // Shows only the y value
                    hovertext: data.online.map(value => `Revenue: $${value}`) // Custom hover text
                }
            ];
        
            let layout = {
                title: 'Revenue by Sales Channel Comparison',
                yaxis: {
                    title: 'Total Revenue',
                    color: 'gray',
                    zeroline: true
                },
                xaxis: {
                    title: 'Sales Channel'
                },
                margin: {
                    l: 50,
                    r: 50,
                    b: 100,
                    t: 100,
                    pad: 4
                },
                showlegend: true
            };
        
            Plotly.newPlot('aovViolinPlot', plotData, layout);
        }
        
        document.getElementById('boxPlotYearSelector').addEventListener('change', function() {
            let selectedYear = this.value;
            fetchDataForViolinPlotYear(selectedYear);
        });
        