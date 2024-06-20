
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
        fetch('/api/aov_comparison_revenue')
    .then(response => response.json())
    .then(data => {
        const trace1 = {
            y: data.in_store,
            type: 'box',
            name: 'In-Store',
            boxpoints: 'all' // Display individual data points
        };

        const trace2 = {
            y: data.online,
            type: 'box',
            name: 'Online',
            boxpoints: 'all' // Display individual data points
        };

        const layout = {
            title: 'AOV Comparison by Revenue - Box and Whisker Chart',
            yaxis: {
                title: 'Total Revenue'
            },
            xaxis: {
                title: 'Sales Channel'
            }
        };

        const plotData = [trace1, trace2];
        Plotly.newPlot('aovBoxPlot', plotData, layout);
    })
    // .catch(error => console.error('Error fetching and plotting data:', error));
        
        // Bar Chart for AOV Comparison
        // fetch('/api/aov_comparison_revenue')
        // .then(response => response.json())
        // .then(data => {
        //     // Prepare traces for each sale_type
        //     const traces = [];
        //     Object.keys(data).forEach(saleType => {
        //         const trace = {
        //             x: data[saleType],
        //             type: 'box',
        //             name: saleType,
        //             boxpoints: 'all' // Display individual data points
        //         };
        //         traces.push(trace);
        //     });
    
        //     const layout = {
        //         title: 'AOV Comparison by Revenue - Box and Whisker Chart',
        //         yaxis: {
        //             title: 'Total Revenue'
        //         },
        //         xaxis: {
        //             title: 'Sales Channel'
        //         }
        //     };
    
        //     // Plot the chart
        //     Plotly.newPlot('aovBarChart', traces, layout);
        // })
        // .catch(error => console.error('Error fetching and plotting data:', error));
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
                        title: 'AOV Comparison by Revenue',
                        xaxis: { title: 'Year' },
                        yaxis: { title: 'Total Revenue' },
                        barmode: 'group'
                    };
        
                    let chartData = [trace1, trace2];
                    Plotly.newPlot('aovBarChart', chartData, layout);
                })
                .catch(error => {
                    console.error('Error fetching and plotting data:', error);
                });
        });
      
        
        
        fetch('/api/aov_comparison_revenue')
    .then(response => response.json())
    .then(data => {
        // Prepare data for Plotly Violin Plot
        const plotData = [
            {
                y: data.online,
                type: 'violin',
                name: 'Online',
                marker: { color: 'rgba(153, 102, 255, 0.5)' },
                box: { visible: true },
                meanline: { visible: true },
                line: { color: 'rgba(153, 102, 255, 1)' }
            },
            {
                y: data.in_store,
                type: 'violin',
                name: 'In-Store',
                marker: { color: 'rgba(255, 102, 102, 0.5)' },
                box: { visible: true },
                meanline: { visible: true },
                line: { color: 'rgba(255, 102, 102, 1)' }
            }
        ];

        // Layout options for the plot
        const layout = {
            title: 'AOV Distribution by Sales Channel',
            yaxis: {
                title: 'Average Order Value (AOV)',
                zeroline: false
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

        // Render the Plotly Violin Plot
        Plotly.newPlot('aovViolinPlot', plotData, layout);
    })
    .catch(error => {
        console.error('Error fetching and plotting data:', error);
    });
    