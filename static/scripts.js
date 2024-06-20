
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
        document.addEventListener('DOMContentLoaded', async function() {
            const boxPlotCtx = document.getElementById('aov-box-plot').getContext('2d');
            const barCtx = document.getElementById('aov-bar-chart').getContext('2d');
            const violinCtx = document.getElementById('aov-violin-plot').getContext('2d');
                
        // Fetch the data from the API for the box plot and bar chart
        const responseAOV = await fetch('/api/aov_comparison');
        const dataAOV = await responseAOV.json();

        // Fetch data from the API for the violin plot
        const responseViolin = await fetch('/api/aov_violin_comparison');
        const dataViolin = await responseViolin.json();
            
        // Box Plot
        new Chart(boxPlotCtx, {
            type: 'boxplot',
            data: {
                labels: ['Online', 'In Store'],
                datasets: [
                    {
                        label: 'Online',
                        data: dataViolin.online,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'In Store',
                        data: dataViolin.in_store,
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
        // Bar Chart for AOV Comparison
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Online', 'In Store'],
                datasets: [{
                    label: 'Average AOV',
                    data: [dataAOV.online_avg, dataAOV.in_store_avg],
                    backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
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
        new Chart(violinCtx, {
            type: 'violin',
            data: {
                labels: ['Online', 'In Store'],
                datasets: [
                    {
                        label: 'Online',
                        data: dataViolin.online,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        pointRadius: 0
                    },
                    {
                        label: 'In Store',
                        data: dataViolin.in_store,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        pointRadius: 0
                    }
                ]
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
    });        