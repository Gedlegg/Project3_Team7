
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
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/aov_comparison')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data for box plot:', data);
        
            const boxPlotData = [
                        { x: 'Online', y: data.online },
                        { x: 'In-Store', y: data.in_store }
                    ];
        
            const ctx = document.getElementById('aovBoxPlot').getContext('2d');
            new Chart(ctx, {
            type: 'boxplot',
            data: {
            labels: ['Online', 'In-Store'],
            datasets: [{
            label: 'AOV Distribution',
            data: boxPlotData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
                            }]
                        },
            options: {
            scales: {
            x: {
            title: {
            display: true,
            text: 'Sales Type'
                        }
                        },
            y: {
            title: {
            display: true,
            text: 'Order Value (USD)'
                        }
                        }
                        },
            plugins: {
            title: {
            display: true,
            text: 'Box Plot: AOV for Online vs. In-Store Sales'
                        }
                        }
                        }
                    });
                })
        .catch(error => console.error('Error fetching data for box plot:', error));
        });
        

        // Bar Chart for AOV Comparison
        document.addEventListener("DOMContentLoaded", function() {
        fetch('/api/aov_comparison')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data for bar chart:', data);
        
                    const ctx = document.getElementById('aovBarChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Online', 'In-Store'],
                            datasets: [{
                                label: 'Average Order Value',
                                data: [data.online_avg, data.in_store_avg],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(75, 192, 192, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(75, 192, 192, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Sales Type'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Average Order Value (USD)'
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Bar Chart: Average Order Value by Sales Type'
                                }
                            }
                        }
                    });
                })
            .catch(error => console.error('Error fetching data for bar chart:', error));
        });
        
    
    
        // Violin Plot for AOV Comparison
        document.addEventListener("DOMContentLoaded", function() {
            fetch('/api/aov_comparison')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data for violin plot:', data);
        
                    const violinPlotData = [
                        { x: 'Online', y: data.online },
                        { x: 'In-Store', y: data.in_store }
                    ];
        
                    const ctx = document.getElementById('aovViolinPlot').getContext('2d');
                    new Chart(ctx, {
                        type: 'violin',
                        data: {
                        labels: ['Online', 'In-Store'],
                        datasets: [{
                        label: 'AOV Distribution',
                        data: violinPlotData,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                            }]
                        },
                        options: {
                        scales: {
                        x: {
                        title: {
                        display: true,
                        text: 'Sales Type'
                                }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Order Value (USD)'
                                    }
                                }
                            },
                            plugins: {
                            title: {
                            display: true,
                            text: 'Violin Plot: AOV Distribution by Sales Type'
                                }
                            }
                        }
                    });
                })
            .catch(error => console.error('Error fetching data for violin plot:', error));
        });
        