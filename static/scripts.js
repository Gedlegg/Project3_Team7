
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
        title: `Trend of Revenue Distribution for ${year}`,
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