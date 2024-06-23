
// 1.Types of Products Sold and Customer Locations:
        // Product Distribution Bar Chart
        
        // Customer Locations Map
        
        // Stacked Bar Chart for Product Types and Regions

// 2. Seasonal Patterns or Trends for Order Volume or Revenue:

// document.addEventListener("DOMContentLoaded", function() {
//         fetch('/api/monthly_order_revenue')
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Fetched data:', data); // Check if data is fetched correctly
//                 const transformedData = [
//                     ...data.online.map(aov => ({ "Channel": "Online", "AOV": aov })),
//                     ...data.in_store.map(aov => ({ "Channel": "In-Store", "AOV": aov }))
//                 ];
//                 console.log('Transformed data:', transformedData); // Verify data transformation
//                 new d3plus.BoxWhisker()
//                     .data(transformedData)
//                     .groupBy("Channel")
//                     .x("Channel")
//                     .y("AOV")
//                     .select("#line-chart-d3plus")
//                     .render();
//             })
//             .catch(error => console.error('Error fetching data:', error)); // Log errors
//     });
//         // Line Chart for Monthly Order Volume and Revenue
//         function renderLineChart(data) {
//                 const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//                 const width = 900 - margin.left - margin.right;
//                 const height = 500 - margin.top - margin.bottom;
            
//                 const svg = d3.select("#line-chart")
//                     .append("svg")
//                     .attr("width", width + margin.left + margin.right)
//                     .attr("height", height + margin.top + margin.bottom)
//                     .append("g")
//                     .attr("transform", `translate(${margin.left},${margin.top})`);
            
//                 const x = d3.scaleTime()
//                     .domain(d3.extent(data, d => d.month))
//                     .range([0, width]);
            
//                 const y = d3.scaleLinear()
//                     .domain([0, d3.max(data, d => Math.max(d.order_volume, d.revenue))])
//                     .range([height, 0]);
            
//                 const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y"));
//                 const yAxis = d3.axisLeft(y);
            
//                 svg.append("g")
//                     .attr("transform", `translate(0,${height})`)
//                     .call(xAxis);
            
//                 svg.append("g")
//                     .call(yAxis);
            
//                 const lineOrderVolume = d3.line()
//                     .x(d => x(d.month))
//                     .y(d => y(d.order_volume));
            
//                 const lineRevenue = d3.line()
//                     .x(d => x(d.month))
//                     .y(d => y(d.revenue));
            
//                 svg.append("path")
//                     .datum(data)
//                     .attr("class", "line order-volume")
//                     .attr("d", lineOrderVolume);
            
//                 svg.append("path")
//                     .datum(data)
//                     .attr("class", "line revenue")
//                     .attr("d", lineRevenue);
            
//                 // Add a legend
//                 svg.append("text")
//                     .attr("x", width - 100)
//                     .attr("y", 30)
//                     .attr("class", "legend")
//                     .style("fill", "steelblue")
//                     .text("Order Volume");
            
//                 svg.append("text")
//                     .attr("x", width - 100)
//                     .attr("y", 50)
//                     .attr("class", "legend")
//                     .style("fill", "orange")
//                     .text("Revenue");
//             }


//         // Line Chart for Monthly Order Volume
// document.addEventListener("DOMContentLoaded", function() {
//         fetch('/api/monthly_order_volume')
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Fetched data:', data); // Check if data is fetched correctly
        
//                     // Transform the data if necessary
//                     const transformedData = data.map(d => ({
//                         month: new Date(d.year, d.month - 1), // Adjust month to be 0-indexed
//                         order_volume: d.order_volume
//                     }));
        
//                     console.log('Transformed data:', transformedData); // Verify data transformation
        
//                     // Render the line chart
//                     renderLineChart(transformedData);
//                 })
//                 .catch(error => console.error('Error fetching data:', error)); // Log errors
//         });
        
//         function renderLineChart(data) {
//             const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//             const width = 900 - margin.left - margin.right;
//             const height = 500 - margin.top - margin.bottom;
        
//             const svg = d3.select("#line-chart")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", `translate(${margin.left},${margin.top})`);
        
//             const x = d3.scaleTime()
//                 .domain(d3.extent(data, d => d.month))
//                 .range([0, width]);
        
//             const y = d3.scaleLinear()
//                 .domain([0, d3.max(data, d => d.order_volume)])
//                 .range([height, 0]);
        
//             const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y"));
//             const yAxis = d3.axisLeft(y);
        
//             svg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(xAxis);
        
//             svg.append("g")
//                 .call(yAxis);
        
//             const line = d3.line()
//                 .x(d => x(d.month))
//                 .y(d => y(d.order_volume));
        
//             svg.append("path")
//                 .datum(data)
//                 .attr("class", "line")
//                 .attr("d", line);
        
//         // Line Chart for Monthly Revenue
//         document.addEventListener("DOMContentLoaded", function() {
//             fetch('/api/monthly_revenue')
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Fetched data:', data); // Check if data is fetched correctly
        
//                     // Transform the data
//                     const transformedData = data.map(d => ({
//                         month: new Date(d.year, d.month - 1), // Adjust month to be 0-indexed
//                         revenue: d.revenue
//                     }));
        
//                     console.log('Transformed data:', transformedData); // Verify data transformation
        
//                     // Render the line chart
//                     renderLineChart(transformedData);
//                 })
//                 .catch(error => console.error('Error fetching data:', error)); // Log errors
//         });
        
//         function renderLineChart(data) {
//             const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//             const width = 900 - margin.left - margin.right;
//             const height = 500 - margin.top - margin.bottom;
        
//             const svg = d3.select("#line-chart")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", `translate(${margin.left},${margin.top})`);
        
//             const x = d3.scaleTime()
//                 .domain(d3.extent(data, d => d.month))
//                 .range([0, width]);
        
//             const y = d3.scaleLinear()
//                 .domain([0, d3.max(data, d => d.revenue)])
//                 .range([height, 0]);
        
//             const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y"));
//             const yAxis = d3.axisLeft(y);
        
//             svg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(xAxis);
        
//             svg.append("g")
//                 .call(yAxis);
        
//             const line = d3.line()
//                 .x(d => x(d.month))
//                 .y(d => y(d.revenue));
        
//             svg.append("path")
//                 .datum(data)
//                 .attr("class", "line")
//                 .attr("d", line);
//         }
        
//         // Heatmap for Monthly Order Volume by Year and Month
//         document.addEventListener("DOMContentLoaded", function() {
//             fetch('/api/monthly_order_heatmap')
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Fetched data:', data); // Check if data is fetched correctly
        
//                     // Transform the data
//                     const transformedData = data.map(d => ({
//                         year: d.year,
//                         month: d.month,
//                         order_volume: d.order_volume
//                     }));
        
//                     console.log('Transformed data:', transformedData); // Verify data transformation
        
//                     // Render the heatmap
//                     renderHeatmap(transformedData);
//                 })
//                 .catch(error => console.error('Error fetching data:', error)); // Log errors
//         });
        
//         function renderHeatmap(data) {
//             const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//             const width = 900 - margin.left - margin.right;
//             const height = 500 - margin.top - margin.bottom;
        
//             const svg = d3.select("#heatmap")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", `translate(${margin.left},${margin.top})`);
        
//             const years = Array.from(new Set(data.map(d => d.year)));
//             const months = Array.from(new Set(data.map(d => d.month)));
        
//             const x = d3.scaleBand()
//                 .domain(years)
//                 .range([0, width])
//                 .padding(0.01);
        
//             const y = d3.scaleBand()
//                 .domain(months)
//                 .range([0, height])
//                 .padding(0.01);
        
//             const colorScale = d3.scaleSequential(d3.interpolateBlues)
//                 .domain([0, d3.max(data, d => d.order_volume)]);
        
//             svg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(d3.axisBottom(x));
        
//             svg.append("g")
//                 .call(d3.axisLeft(y));
        
//             svg.selectAll()
//                 .data(data, function(d) { return d.year + ':' + d.month; })
//                 .enter()
//                 .append("rect")
//                 .attr("x", function(d) { return x(d.year); })
//                 .attr("y", function(d) { return y(d.month); })
//                 .attr("width", x.bandwidth())
//                 .attr("height", y.bandwidth())
//                 .style("fill", function(d) { return colorScale(d.order_volume); });
        
//             // Add title to the heatmap
//             svg.append("text")
//                 .attr("x", width / 2)
//                 .attr("y", -10)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "16px")
//                 .style("text-decoration", "underline")
//                 .text("Monthly Order Volume Heatmap");
        
//             // Add axis labels
//             svg.append("text")
//                 .attr("x", width / 2)
//                 .attr("y", height + margin.bottom - 10)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Year");
        
//             svg.append("text")
//                 .attr("transform", "rotate(-90)")
//                 .attr("x", -height / 2)
//                 .attr("y", -margin.left + 20)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Month");
//         }
        
//         // Heatmap for Monthly Revenue by Year and Month    
//         document.addEventListener("DOMContentLoaded", function() {
//             fetch('/api/monthly_revenue_heatmap')
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Fetched data:', data); // Check if data is fetched correctly
        
//                     // Transform the data if necessary
//                     const transformedData = data.map(d => ({
//                         year: d.year,
//                         month: d.month,
//                         revenue: d.revenue
//                     }));
        
//                     console.log('Transformed data:', transformedData); // Verify data transformation
        
//                     // Render the heatmap
//                     renderHeatmap(transformedData);
//                 })
//                 .catch(error => console.error('Error fetching data:', error)); // Log errors
//         });
        
//         function renderHeatmap(data) {
//             const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//             const width = 900 - margin.left - margin.right;
//             const height = 500 - margin.top - margin.bottom;
        
//             const svg = d3.select("#heatmap")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", `translate(${margin.left},${margin.top})`);
        
//             const years = Array.from(new Set(data.map(d => d.year)));
//             const months = Array.from(new Set(data.map(d => d.month)));
        
//             const x = d3.scaleBand()
//                 .domain(years)
//                 .range([0, width])
//                 .padding(0.01);
        
//             const y = d3.scaleBand()
//                 .domain(months)
//                 .range([0, height])
//                 .padding(0.01);
        
//             const colorScale = d3.scaleSequential(d3.interpolateBlues)
//                 .domain([0, d3.max(data, d => d.revenue)]);
        
//             svg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(d3.axisBottom(x));
        
//             svg.append("g")
//                 .call(d3.axisLeft(y));
        
//             svg.selectAll()
//                 .data(data, function(d) { return d.year + ':' + d.month; })
//                 .enter()
//                 .append("rect")
//                 .attr("x", function(d) { return x(d.year); })
//                 .attr("y", function(d) { return y(d.month); })
//                 .attr("width", x.bandwidth())
//                 .attr("height", y.bandwidth())
//                 .style("fill", function(d) { return colorScale(d.revenue); });
        
//             // Add title to the heatmap
//             svg.append("text")
//                 .attr("x", width / 2)
//                 .attr("y", -10)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "16px")
//                 .style("text-decoration", "underline")
//                 .text("Monthly Revenue Heatmap");
        
//             // Add axis labels
//             svg.append("text")
//                 .attr("x", width / 2)
//                 .attr("y", height + margin.bottom - 10)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Year");
        
//             svg.append("text")
//                 .attr("transform", "rotate(-90)")
//                 .attr("x", -height / 2)
//                 .attr("y", -margin.left + 20)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Month");
//         }
        
//         // Box Plot for Order Volumes by Season or Month
//         document.addEventListener("DOMContentLoaded", function() {
//             fetch('/api/seasonal_order_distribution')
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Fetched data:', data); // Check if data is fetched correctly
        
//                     // Transform the data if necessary
//                     const transformedData = data.map(d => ({
//                         season: d.season, // or 'month' if grouping by month
//                         order_volume: d.order_volume
//                     }));
        
//                     console.log('Transformed data:', transformedData); // Verify data transformation
        
//                     // Render the box plot
//                     renderBoxPlot(transformedData);
//                 })
//                 .catch(error => console.error('Error fetching data:', error)); // Log errors
//         });
        
//         function renderBoxPlot(data) {
//             const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//             const width = 900 - margin.left - margin.right;
//             const height = 500 - margin.top - margin.bottom;
        
//             const svg = d3.select("#box-plot")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", `translate(${margin.left},${margin.top})`);
        
//             const seasons = Array.from(new Set(data.map(d => d.season)));
        
//             const x = d3.scaleBand()
//                 .domain(seasons)
//                 .range([0, width])
//                 .padding(0.1);
        
//             const y = d3.scaleLinear()
//                 .domain([0, d3.max(data, d => d.order_volume)])
//                 .range([height, 0]);
        
//             const xAxis = d3.axisBottom(x);
//             const yAxis = d3.axisLeft(y);
        
//             svg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(xAxis);
        
//             svg.append("g")
//                 .call(yAxis);
        
//             // Box plot calculations
//             const boxPlotData = d3.nest()
//                 .key(d => d.season)
//                 .rollup(values => {
//                     const q1 = d3.quantile(values.map(v => v.order_volume).sort(d3.ascending), 0.25);
//                     const median = d3.quantile(values.map(v => v.order_volume).sort(d3.ascending), 0.5);
//                     const q3 = d3.quantile(values.map(v => v.order_volume).sort(d3.ascending), 0.75);
//                     const iqr = q3 - q1;
//                     const min = q1 - 1.5 * iqr;
//                     const max = q3 + 1.5 * iqr;
//                     return { q1, median, q3, min, max };
//                 })
//                 .entries(data);
        
//             // Draw the boxes
//             svg.selectAll(".box")
//                 .data(boxPlotData)
//                 .enter()
//                 .append("rect")
//                 .attr("class", "box")
//                 .attr("x", d => x(d.key))
//                 .attr("y", d => y(d.value.q3))
//                 .attr("width", x.bandwidth())
//                 .attr("height", d => y(d.value.q1) - y(d.value.q3));
        
//             // Draw the medians
//             svg.selectAll(".median")
//                 .data(boxPlotData)
//                 .enter()
//                 .append("line")
//                 .attr("class", "median")
//                 .attr("x1", d => x(d.key))
//                 .attr("x2", d => x(d.key) + x.bandwidth())
//                 .attr("y1", d => y(d.value.median))
//                 .attr("y2", d => y(d.value.median));
        
//             // Add axis labels
//             svg.append("text")
//                 .attr("x", width / 2)
//                 .attr("y", height + margin.bottom - 10)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Season");
        
//             svg.append("text")
//                 .attr("transform", "rotate(-90)")
//                 .attr("x", -height / 2)
//                 .attr("y", -margin.left + 20)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Order Volume");
//         }
         
//         // Box Plot for Revenues by Season or Month
//         document.addEventListener("DOMContentLoaded", function() {
//             fetch('/api/seasonal_revenue_distribution')
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Fetched data:', data); // Check if data is fetched correctly
        
//                     // Transform the data if necessary
//                     const transformedData = data.map(d => ({
//                         season: d.season, // or 'month' if grouping by month
//                         revenue: d.revenue
//                     }));
        
//                     console.log('Transformed data:', transformedData); // Verify data transformation
        
//                     // Render the box plot
//                     renderBoxPlot(transformedData);
//                 })
//                 .catch(error => console.error('Error fetching data:', error)); // Log errors
//         });
        
//         function renderBoxPlot(data) {
//             const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//             const width = 900 - margin.left - margin.right;
//             const height = 500 - margin.top - margin.bottom;
        
//             const svg = d3.select("#box-plot")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", `translate(${margin.left},${margin.top})`);
        
//             const seasons = Array.from(new Set(data.map(d => d.season)));
        
//             const x = d3.scaleBand()
//                 .domain(seasons)
//                 .range([0, width])
//                 .padding(0.1);
        
//             const y = d3.scaleLinear()
//                 .domain([0, d3.max(data, d => d.revenue)])
//                 .range([height, 0]);
        
//             const xAxis = d3.axisBottom(x);
//             const yAxis = d3.axisLeft(y);
        
//             svg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(xAxis);
        
//             svg.append("g")
//                 .call(yAxis);
        
//             // Box plot calculations
//             const boxPlotData = d3.groups(data, d => d.season)
//                 .map(([key, values]) => {
//                     const sortedValues = values.map(d => d.revenue).sort(d3.ascending);
//                     const q1 = d3.quantile(sortedValues, 0.25);
//                     const median = d3.quantile(sortedValues, 0.5);
//                     const q3 = d3.quantile(sortedValues, 0.75);
//                     const iqr = q3 - q1;
//                     const min = Math.max(d3.min(sortedValues), q1 - 1.5 * iqr);
//                     const max = Math.min(d3.max(sortedValues), q3 + 1.5 * iqr);
//                     return { season: key, q1, median, q3, min, max };
//                 });
        
//             // Draw the boxes
//             svg.selectAll(".box")
//                 .data(boxPlotData)
//                 .enter()
//                 .append("rect")
//                 .attr("class", "box")
//                 .attr("x", d => x(d.season))
//                 .attr("y", d => y(d.q3))
//                 .attr("width", x.bandwidth())
//                 .attr("height", d => y(d.q1) - y(d.q3));
        
//             // Draw the medians
//             svg.selectAll(".median")
//                 .data(boxPlotData)
//                 .enter()
//                 .append("line")
//                 .attr("class", "median")
//                 .attr("x1", d => x(d.season))
//                 .attr("x2", d => x(d.season) + x.bandwidth())
//                 .attr("y1", d => y(d.median))
//                 .attr("y2", d => y(d.median));
        
//             // Draw the min and max lines
//             svg.selectAll(".min-max")
//                 .data(boxPlotData)
//                 .enter()
//                 .append("line")
//                 .attr("class", "min-max")
//                 .attr("x1", d => x(d.season) + x.bandwidth() / 2)
//                 .attr("x2", d => x(d.season) + x.bandwidth() / 2)
//                 .attr("y1", d => y(d.min))
//                 .attr("y2", d => y(d.max));
        
//             // Add axis labels
//             svg.append("text")
//                 .attr("x", width / 2)
//                 .attr("y", height + margin.bottom - 10)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Season");
        
//             svg.append("text")
//                 .attr("transform", "rotate(-90)")
//                 .attr("x", -height / 2)
//                 .attr("y", -margin.left + 20)
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "12px")
//                 .text("Revenue");
//         }
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 3. Average Delivery Time in Days Over Time:
    
    ///// Line Chart for Average Delivery Time /////

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
        mode: "lines+markers"                            
        };

        // Trace for the regression line
        let trace2 = {
            x: months,
            y: regressionY,
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'red' },
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

    d3.json('http://127.0.0.1:5000/api/average_delivery_time').then(data => {
        
        UpdatePlot(data, "All Regions");
     
        d3.selectAll("#SelectRegion").on("change", function() {

            let SelOption = d3.select(this);
            let SelCurrencyCode = SelOption.property("value");
                        
            UpdatePlot(data, SelCurrencyCode);
        });
        
    });





    ///// Bar Chart for Product-wise Delivery Times /////

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
               


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// 4. Difference in Average Order Value (AOV) for Online vs. In-Store Sales:
        // Box Plot for AOV Comparison

        // Bar Chart for AOV Comparison
        // Create a D3plus bar chart
        // Violin Plot for AOV Comparison
       

        // document.addEventListener("DOMContentLoaded", function() {
        //         fetch('/api/aov_comparison')
        //             .then(response => response.json())
        //             .then(data => {
        //                 console.log('Fetched data:', data); // Check if data is fetched correctly
        //                 const transformedData = [
        //                     ...data.online.map(aov => ({ "Channel": "Online", "AOV": aov })),
        //                     ...data.in_store.map(aov => ({ "Channel": "In-Store", "AOV": aov }))
        //                 ];
        //                 console.log('Transformed data:', transformedData); // Verify data transformation
        //                 new d3plus.BoxWhisker()
        //                     .data(transformedData)
        //                     .groupBy("Channel")
        //                     .x("Channel")
        //                     .y("AOV")
        //                     .select("#aov-box-plot-d3plus")
        //                     .render();
        //             })
        //             .catch(error => console.error('Error fetching data:', error)); // Log errors
        //     });
        
        // // Bar Chart
        // new d3plus.BarChart()
        // .data(transformedData)
        // .groupBy("Channel")
        // .x("Channel")
        // .y("AOV")
        // .select("#aov-bar-chart-d3plus")
        // .render

        // // Box Plot for AOV Comparison
        //     new d3plus.BoxWhisker()
        //         .data(transformedData)
        //         .groupBy("Channel")
        //         .x("Channel")
        //         .y("AOV")
        //         .select("#aov-box-plot-d3plus")
        //         .render();