
// 1.Types of Products Sold and Customer Locations:
        // Product Distribution Bar Chart
        
        // Customer Locations Map
        
        // Stacked Bar Chart for Product Types and Regions

// 2. Seasonal Patterns or Trends for Order Volume or Revenue:
        // Line Chart for Monthly Order Volume and Revenue

        // Line Chart for Monthly Order Volume

        // Line Chart for Monthly Revenue

        // Heatmap for Monthly Order Volume by Year and Month
        
        // Heatmap for Monthly Revenue by Year and Month    

        // Box Plot for Order Volumes by Season or Month

        // Box Plot for Revenues by Season or Month

// 3. Average Delivery Time in Days Over Time:
        // Line Chart for Average Delivery Time

        // Histogram for Delivery Time Distribution

        // Scatter Plot for Delivery Times Over Time

// 4. Difference in Average Order Value (AOV) for Online vs. In-Store Sales:
        // Box Plot for AOV Comparison

        // Bar Chart for AOV Comparison
        // Create a D3plus bar chart
        // Violin Plot for AOV Comparison
       

        document.addEventListener("DOMContentLoaded", function() {
                fetch('/api/aov_comparison')
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
                            .select("#aov-box-plot-d3plus")
                            .render();
                    })
                    .catch(error => console.error('Error fetching data:', error)); // Log errors
            });
        
        // Bar Chart
        new d3plus.BarChart()
        .data(transformedData)
        .groupBy("Channel")
        .x("Channel")
        .y("AOV")
        .select("#aov-bar-chart-d3plus")
        .render

        // Box Plot for AOV Comparison
            new d3plus.BoxWhisker()
                .data(transformedData)
                .groupBy("Channel")
                .x("Channel")
                .y("AOV")
                .select("#aov-box-plot-d3plus")
                .render();
        
            
                
        
        
        
        
        
        
        
        
        