
// 1.Types of Products Sold and Customer Locations:
        // Product Distribution Bar Chart
        
        // Customer Locations Map
        
        // Stacked Bar Chart for Product Types and Regions

// 2. Seasonal Patterns or Trends for Order Volume or Revenue:

document.addEventListener("DOMContentLoaded", function() {
        fetch('/api/monthly_order_revenue')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data); // Check if data is fetched correctly
                const transformedData = [
                    ...data.online.map(aov => ({ "Channel": "Online", "AOV": aov })),
                    ...data.in_store.map(aov => ({ "Channel": "In-Store", "AOV": aov }))
                ];
                console.log('Transformed data:', transformedData); // Verify data transformation
                new d3plus.BoxWhisker()
                    .data(transformedData)
                    .groupBy("Channel")
                    .x("Channel")
                    .y("AOV")
                    .select("#line-chart-d3plus")
                    .render();
            })
            .catch(error => console.error('Error fetching data:', error)); // Log errors
    });
        // Line Chart for Monthly Order Volume and Revenue
        function renderLineChart(data) {
                const margin = { top: 50, right: 50, bottom: 50, left: 50 };
                const width = 900 - margin.left - margin.right;
                const height = 500 - margin.top - margin.bottom;
            
                const svg = d3.select("#line-chart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
            
                const x = d3.scaleTime()
                    .domain(d3.extent(data, d => d.month))
                    .range([0, width]);
            
                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => Math.max(d.order_volume, d.revenue))])
                    .range([height, 0]);
            
                const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y"));
                const yAxis = d3.axisLeft(y);
            
                svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(xAxis);
            
                svg.append("g")
                    .call(yAxis);
            
                const lineOrderVolume = d3.line()
                    .x(d => x(d.month))
                    .y(d => y(d.order_volume));
            
                const lineRevenue = d3.line()
                    .x(d => x(d.month))
                    .y(d => y(d.revenue));
            
                svg.append("path")
                    .datum(data)
                    .attr("class", "line order-volume")
                    .attr("d", lineOrderVolume);
            
                svg.append("path")
                    .datum(data)
                    .attr("class", "line revenue")
                    .attr("d", lineRevenue);
            
                // Add a legend
                svg.append("text")
                    .attr("x", width - 100)
                    .attr("y", 30)
                    .attr("class", "legend")
                    .style("fill", "steelblue")
                    .text("Order Volume");
            
                svg.append("text")
                    .attr("x", width - 100)
                    .attr("y", 50)
                    .attr("class", "legend")
                    .style("fill", "orange")
                    .text("Revenue");
            }


        // Line Chart for Monthly Order Volume
document.addEventListener("DOMContentLoaded", function() {
        fetch('/api/monthly_order_volume')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data); // Check if data is fetched correctly
        
                    // Transform the data if necessary
                    const transformedData = data.map(d => ({
                        month: new Date(d.year, d.month - 1), // Adjust month to be 0-indexed
                        order_volume: d.order_volume
                    }));
        
                    console.log('Transformed data:', transformedData); // Verify data transformation
        
                    // Render the line chart
                    renderLineChart(transformedData);
                })
                .catch(error => console.error('Error fetching data:', error)); // Log errors
        });
        
        function renderLineChart(data) {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
        
            const svg = d3.select("#line-chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.month))
                .range([0, width]);
        
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.order_volume)])
                .range([height, 0]);
        
            const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y"));
            const yAxis = d3.axisLeft(y);
        
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);
        
            svg.append("g")
                .call(yAxis);
        
            const line = d3.line()
                .x(d => x(d.month))
                .y(d => y(d.order_volume));
        
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        
        // Line Chart for Monthly Revenue
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/monthly_revenue')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data); // Check if data is fetched correctly
        
                    // Transform the data
                    const transformedData = data.map(d => ({
                        month: new Date(d.year, d.month - 1), // Adjust month to be 0-indexed
                        revenue: d.revenue
                    }));
        
                    console.log('Transformed data:', transformedData); // Verify data transformation
        
                    // Render the line chart
                    renderLineChart(transformedData);
                })
                .catch(error => console.error('Error fetching data:', error)); // Log errors
        });
        
        function renderLineChart(data) {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
        
            const svg = d3.select("#line-chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.month))
                .range([0, width]);
        
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.revenue)])
                .range([height, 0]);
        
            const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y"));
            const yAxis = d3.axisLeft(y);
        
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);
        
            svg.append("g")
                .call(yAxis);
        
            const line = d3.line()
                .x(d => x(d.month))
                .y(d => y(d.revenue));
        
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        }
        
        // Heatmap for Monthly Order Volume by Year and Month
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/monthly_order_heatmap')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data); // Check if data is fetched correctly
        
                    // Transform the data
                    const transformedData = data.map(d => ({
                        year: d.year,
                        month: d.month,
                        order_volume: d.order_volume
                    }));
        
                    console.log('Transformed data:', transformedData); // Verify data transformation
        
                    // Render the heatmap
                    renderHeatmap(transformedData);
                })
                .catch(error => console.error('Error fetching data:', error)); // Log errors
        });
        
        function renderHeatmap(data) {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
        
            const svg = d3.select("#heatmap")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const years = Array.from(new Set(data.map(d => d.year)));
            const months = Array.from(new Set(data.map(d => d.month)));
        
            const x = d3.scaleBand()
                .domain(years)
                .range([0, width])
                .padding(0.01);
        
            const y = d3.scaleBand()
                .domain(months)
                .range([0, height])
                .padding(0.01);
        
            const colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain([0, d3.max(data, d => d.order_volume)]);
        
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        
            svg.append("g")
                .call(d3.axisLeft(y));
        
            svg.selectAll()
                .data(data, function(d) { return d.year + ':' + d.month; })
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.year); })
                .attr("y", function(d) { return y(d.month); })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function(d) { return colorScale(d.order_volume); });
        
            // Add title to the heatmap
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -10)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Monthly Order Volume Heatmap");
        
            // Add axis labels
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Year");
        
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Month");
        }
        
        // Heatmap for Monthly Revenue by Year and Month    
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/monthly_revenue_heatmap')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data); // Check if data is fetched correctly
        
                    // Transform the data if necessary
                    const transformedData = data.map(d => ({
                        year: d.year,
                        month: d.month,
                        revenue: d.revenue
                    }));
        
                    console.log('Transformed data:', transformedData); // Verify data transformation
        
                    // Render the heatmap
                    renderHeatmap(transformedData);
                })
                .catch(error => console.error('Error fetching data:', error)); // Log errors
        });
        
        function renderHeatmap(data) {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
        
            const svg = d3.select("#heatmap")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const years = Array.from(new Set(data.map(d => d.year)));
            const months = Array.from(new Set(data.map(d => d.month)));
        
            const x = d3.scaleBand()
                .domain(years)
                .range([0, width])
                .padding(0.01);
        
            const y = d3.scaleBand()
                .domain(months)
                .range([0, height])
                .padding(0.01);
        
            const colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain([0, d3.max(data, d => d.revenue)]);
        
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
        
            svg.append("g")
                .call(d3.axisLeft(y));
        
            svg.selectAll()
                .data(data, function(d) { return d.year + ':' + d.month; })
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.year); })
                .attr("y", function(d) { return y(d.month); })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function(d) { return colorScale(d.revenue); });
        
            // Add title to the heatmap
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -10)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Monthly Revenue Heatmap");
        
            // Add axis labels
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Year");
        
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Month");
        }
        
        // Box Plot for Order Volumes by Season or Month
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/seasonal_order_distribution')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data); // Check if data is fetched correctly
        
                    // Transform the data if necessary
                    const transformedData = data.map(d => ({
                        season: d.season, // or 'month' if grouping by month
                        order_volume: d.order_volume
                    }));
        
                    console.log('Transformed data:', transformedData); // Verify data transformation
        
                    // Render the box plot
                    renderBoxPlot(transformedData);
                })
                .catch(error => console.error('Error fetching data:', error)); // Log errors
        });
        
        function renderBoxPlot(data) {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
        
            const svg = d3.select("#box-plot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const seasons = Array.from(new Set(data.map(d => d.season)));
        
            const x = d3.scaleBand()
                .domain(seasons)
                .range([0, width])
                .padding(0.1);
        
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.order_volume)])
                .range([height, 0]);
        
            const xAxis = d3.axisBottom(x);
            const yAxis = d3.axisLeft(y);
        
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);
        
            svg.append("g")
                .call(yAxis);
        
            // Box plot calculations
            const boxPlotData = d3.nest()
                .key(d => d.season)
                .rollup(values => {
                    const q1 = d3.quantile(values.map(v => v.order_volume).sort(d3.ascending), 0.25);
                    const median = d3.quantile(values.map(v => v.order_volume).sort(d3.ascending), 0.5);
                    const q3 = d3.quantile(values.map(v => v.order_volume).sort(d3.ascending), 0.75);
                    const iqr = q3 - q1;
                    const min = q1 - 1.5 * iqr;
                    const max = q3 + 1.5 * iqr;
                    return { q1, median, q3, min, max };
                })
                .entries(data);
        
            // Draw the boxes
            svg.selectAll(".box")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("class", "box")
                .attr("x", d => x(d.key))
                .attr("y", d => y(d.value.q3))
                .attr("width", x.bandwidth())
                .attr("height", d => y(d.value.q1) - y(d.value.q3));
        
            // Draw the medians
            svg.selectAll(".median")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("class", "median")
                .attr("x1", d => x(d.key))
                .attr("x2", d => x(d.key) + x.bandwidth())
                .attr("y1", d => y(d.value.median))
                .attr("y2", d => y(d.value.median));
        
            // Add axis labels
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Season");
        
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Order Volume");
        }
         
        // Box Plot for Revenues by Season or Month
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/seasonal_revenue_distribution')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data); // Check if data is fetched correctly
        
                    // Transform the data if necessary
                    const transformedData = data.map(d => ({
                        season: d.season, // or 'month' if grouping by month
                        revenue: d.revenue
                    }));
        
                    console.log('Transformed data:', transformedData); // Verify data transformation
        
                    // Render the box plot
                    renderBoxPlot(transformedData);
                })
                .catch(error => console.error('Error fetching data:', error)); // Log errors
        });
        
        function renderBoxPlot(data) {
            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
        
            const svg = d3.select("#box-plot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const seasons = Array.from(new Set(data.map(d => d.season)));
        
            const x = d3.scaleBand()
                .domain(seasons)
                .range([0, width])
                .padding(0.1);
        
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.revenue)])
                .range([height, 0]);
        
            const xAxis = d3.axisBottom(x);
            const yAxis = d3.axisLeft(y);
        
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);
        
            svg.append("g")
                .call(yAxis);
        
            // Box plot calculations
            const boxPlotData = d3.groups(data, d => d.season)
                .map(([key, values]) => {
                    const sortedValues = values.map(d => d.revenue).sort(d3.ascending);
                    const q1 = d3.quantile(sortedValues, 0.25);
                    const median = d3.quantile(sortedValues, 0.5);
                    const q3 = d3.quantile(sortedValues, 0.75);
                    const iqr = q3 - q1;
                    const min = Math.max(d3.min(sortedValues), q1 - 1.5 * iqr);
                    const max = Math.min(d3.max(sortedValues), q3 + 1.5 * iqr);
                    return { season: key, q1, median, q3, min, max };
                });
        
            // Draw the boxes
            svg.selectAll(".box")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("class", "box")
                .attr("x", d => x(d.season))
                .attr("y", d => y(d.q3))
                .attr("width", x.bandwidth())
                .attr("height", d => y(d.q1) - y(d.q3));
        
            // Draw the medians
            svg.selectAll(".median")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("class", "median")
                .attr("x1", d => x(d.season))
                .attr("x2", d => x(d.season) + x.bandwidth())
                .attr("y1", d => y(d.median))
                .attr("y2", d => y(d.median));
        
            // Draw the min and max lines
            svg.selectAll(".min-max")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("class", "min-max")
                .attr("x1", d => x(d.season) + x.bandwidth() / 2)
                .attr("x2", d => x(d.season) + x.bandwidth() / 2)
                .attr("y1", d => y(d.min))
                .attr("y2", d => y(d.max));
        
            // Add axis labels
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Season");
        
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text("Revenue");
        }
        

// 3. Average Delivery Time in Days Over Time:
        // Line Chart for Average Delivery Time

        // Histogram for Delivery Time Distribution

        // Scatter Plot for Delivery Times Over Time

// 4. Difference in Average Order Value (AOV) for Online vs. In-Store Sales:
        // Box Plot for AOV Comparison
        document.addEventListener('DOMContentLoaded', async function() {
                
                const boxPlotCtx = document.getElementById('aovBoxPlotChart').getContext('2d');
                const barCtx = document.getElementById('aovBarChart').getContext('2d');
                const violinCtx = document.getElementById('aovViolinChart').getContext('2d');
            
                // Fetch the data from the API
                const response = await fetch('http://127.0.0.1:5000/api/aov_violin_comparison');
                const data = await response.json();
                const boxPlotChart = new Chart(boxPlotCtx, {
                        type: 'boxplot',
                        data: {
                            labels: ['Online', 'In Store'],
                            datasets: [
                                {
                                    label: 'Online',
                                    data: [data.online],
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'In Store',
                                    data: [data.in_store],
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }
                            ]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Price (USD)'
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Box Plot: Online vs In Store'
                                }
                            }
                        }
                    });
                });
                
        // Bar Chart for AOV Comparison
        const barChart = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Online', 'In Store'],
                    datasets: [{
                        label: 'Average AOV',
                        data: [
                            data.average_aov.online, 
                            data.average_aov.in_store
                        ],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Average AOV (USD)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Average AOV: Online vs In Store'
                        }
                    }
                }
            });
        
        // Violin Plot for AOV Comparison
        const violinChart = new Chart(violinCtx, {
                type: 'violin',
                data: {
                    labels: ['Online', 'In Store'],
                    datasets: [
                        {
                            label: 'Online',
                            data: data.online,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                        },
                        {
                            label: 'In Store',
                            data: data.in_store,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                        }
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Total Price (USD)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'AOV Comparison: Online vs In Store'
                        }
                    }
                }
            });
        