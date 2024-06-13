from flask import Flask, jsonify, render_template
import sqlite3
import pandas as pd
from collections import defaultdict
from datetime import datetime

app = Flask(__name__)

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('sales_dashboard.sqlite')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/')
def index():  
    """List all available routes."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home:API</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
            }
            h1 {
                color: #333;
                margin-bottom: 30px;
            }
            nav {
                margin-bottom: 20px;
            }
            nav ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
            }
            nav li {
                display: inline;
                margin-right: 10px;
            }
            nav a {
                text-decoration: none;
                color: #007bff;
            }
            nav a:hover {
                text-decoration: underline;
            }
            .container {
                max-width: 800px;
                margin: auto;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Home</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                    
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container">
            <h1>Welcome to the Global Electronics Retailers Home Page</h1>
      
        </div>
        <div class="container">
            <h2>Available Routes:</h2>
            <p> This platform offers several routes for accessing data:</p>
            <ul>
                <li><a href="/api/product_distribution">/api/product_distribution</a> - Get product distribution data</li>
                <li><a href="/api/customer_locations">/api/customer_locations</a> - Get customer location data</li>
                <li><a href="/api/product_region_distribution">/api/product_region_distribution</a> - Get product region distribution data</li>
                <li><a href="/api/monthly_order_revenue">//api/monthly_order_revenue</a> - Get order volume by revenue distribution data</li>
                <li><a href="/api/monthly_order_volume">/api/monthly_order_volume</a> - Get monthly order volume data</li>
                <li><a href="/api/monthly_revenue">/api/monthly_revenue</a> - Get monthly revenue data</li>
                <li><a href="/api/monthly_order_heatmap">/api/monthly_order_heatmap</a> - Get monthly order heatmap data</li>
                <li><a href="/api/monthly_revenue_heatmap">/api/monthly_revenue_heatmap</a> - Get monthly revenue heatmap data</li>
                <li><a href="/api/seasonal_order_distribution">/api/seasonal_order_distribution</a> - Get seasonal order distribution data</li>
                <li><a href="/api/seasonal_revenue_distribution">/api/seasonal_revenue_distribution</a> - Get seasonal revenue distribution data</li>
                <li><a href="/api/average_delivery_time">/api/average_delivery_time</a> - Get average delivery time data</li>
                <li><a href="/api/delivery_time_distribution">/api/delivery_time_distribution</a> - Get delivery time distribution data</li>
                <li><a href="/api/delivery_time_scatter">/api/delivery_time_scatter</a> - Get delivery time scatter data</li>
                <li><a href="/api/aov_comparison">/api/aov_comparison</a> - Get AOV comparison data</li>
                <li><a href="/api/aov_violin_comparison">/api/aov_violin_comparison</a> - Get AOV violin comparison data</li>
            </ul>
            
        </div>
    </body>
    </html>
    """

# 1.Types of Products Sold and Customer Locations:
# Product Distribution Bar Chart
@app.route('/api/product_distribution')
def product_distribution():
    query = """
    SELECT category, COUNT(*) as count
    FROM products
    GROUP BY category
    """
    result = query_db(query)
    data = {'categories': [row['category'] for row in result], 'counts': [row['count'] for row in result]}
    return jsonify(data)

# Customer Locations Map
@app.route('/api/customer_locations')
def customer_locations():
    query = """
    SELECT city, state, country, latitude, longitude, COUNT(*) as count
    FROM customers
    GROUP BY city, state, country
    """
    result = query_db(query)
    data = [{'city': row['city'], 'state': row['state'], 'country': row['country'], 'latitude': row['latitude'], 'longitude': row['longitude'], 'count': row['count']} for row in result]
    return jsonify(data)

# Stacked Bar Chart for Product Types and Regions
@app.route('/api/product_region_distribution')
def product_region_distribution():
    query = """
    SELECT products.category, customers.state, COUNT(sales.order_number) as count
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    JOIN customers ON sales.customer_id = customers.customer_id
    GROUP BY products.category, customers.state
    """
    result = query_db(query)
    data = {}
    for row in result:
        category = row['category']
        state = row['state']
        count = row['count']
        if state not in data:
            data[state] = {}
        if category not in data[state]:
            data[state][category] = 0
        data[state][category] += count

    regions = list(data.keys())
    categories = list(set(cat for region in data.values() for cat in region))
    category_data = [{'name': cat, 'data': [data[region].get(cat, 0) for region in regions], 'color': generate_random_color()} for cat in categories]
    
    return jsonify({'regions': regions, 'categories': category_data})

def generate_random_color():
    import random
    return f'rgba({random.randint(0,255)}, {random.randint(0,255)}, {random.randint(0,255)}, 0.5)'

# 2. Seasonal Patterns or Trends for Order Volume or Revenue:
# Line Chart for Monthly Order Volume and Revenue
@app.route('/api/monthly_order_revenue')
def monthly_order_revenue():
    query = """
    SELECT strftime('%Y', s.order_date) as year, strftime('%m', s.order_date) as month, 
           COUNT(s.order_number) as order_count, SUM(s.quantity * p.unit_price_usd) as revenue
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    GROUP BY year, month
    ORDER BY year, month
    """
    result = query_db(query)
    data = [{'year': row['year'], 'month': row['month'], 'order_count': row['order_count'], 'revenue': row['revenue']} for row in result]
    return jsonify(data)
# Line Chart for Monthly Order Volume
@app.route('/api/monthly_order_volume')
def monthly_order_volume():
    query = """
    SELECT strftime('%Y-%m', order_date) as month, COUNT(order_number) as order_counts
    FROM sales
    GROUP BY strftime('%Y-%m', order_date)
    ORDER BY month
    """
    result = query_db(query)
    data = {'months': [row['month'] for row in result], 'order_counts': [row['order_counts'] for row in result]}
    return jsonify(data)

# Line Chart for Monthly Revenue
@app.route('/api/monthly_revenue')
def monthly_revenue():
    query = """
    SELECT strftime('%Y-%m', order_date) as month, SUM(quantity * unit_price_usd) as revenue
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    GROUP BY strftime('%Y-%m', order_date)
    ORDER BY month
    """
    result = query_db(query)
    data = {'months': [row['month'] for row in result], 'revenues': [row['revenue'] for row in result]}
    return jsonify(data)
# Heatmap for Monthly Order Volume by Year and Month
@app.route('/api/monthly_order_heatmap')
def monthly_order_heatmap():
    query = """
    SELECT strftime('%Y', order_date) as year, strftime('%m', order_date) as month, COUNT(order_number) as order_count
    FROM sales
    GROUP BY year, month
    ORDER BY year, month
    """
    result = query_db(query)
    data = [{'year': row['year'], 'month': row['month'], 'order_count': row['order_count']} for row in result]
    return jsonify(data)
  
# Heatmap for Monthly Revenue by Year and Month    
@app.route('/api/monthly_revenue_heatmap')
def monthly_revenue_heatmap():
    query = """
    SELECT strftime('%Y', order_date) as year, strftime('%m', order_date) as month, SUM(quantity * unit_price_usd) as revenue
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    GROUP BY year, month
    ORDER BY year, month
    """
    result = query_db(query)
    data = [{'year': row['year'], 'month': row['month'], 'revenue': row['revenue']} for row in result]
    return jsonify(data)
# Box Plot for Order Volumes by Season or Month
@app.route('/api/seasonal_order_distribution')
def seasonal_order_distribution():
    query = """
    SELECT strftime('%m', order_date) as month, COUNT(order_number) as order_count
    FROM sales
    GROUP BY month
    ORDER BY month
    """
    result = query_db(query)
    data = {'months': [row['month'] for row in result], 'order_counts': [row['order_count'] for row in result]}
    return jsonify(data)

# Box Plot for Revenues by Season or Month
@app.route('/api/seasonal_revenue_distribution')
def seasonal_revenue_distribution():
    query = """
    SELECT strftime('%m', order_date) as month, SUM(quantity * unit_price_usd) as revenue
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    GROUP BY month
    ORDER BY month
    """
    result = query_db(query)
    data = {'months': [row['month'] for row in result], 'revenues': [row['revenue'] for row in result]}
    return jsonify(data)

# 3. Average Delivery Time in Days Over Time:
# Line Chart for Average Delivery Time
@app.route('/api/average_delivery_time')
def average_delivery_time():
    query = """
    SELECT strftime('%Y-%m', order_date) as Month, AVG(julianday(delivery_date) - julianday(order_date)) as AvgDeliveryTime
    FROM sales
    GROUP BY strftime('%Y-%m', order_date)
    ORDER BY Month
    """
    result = query_db(query)
    data = {'months': [row['Month'] for row in result], 'avg_delivery_times': [row['AvgDeliveryTime'] for row in result]}
    return jsonify(data)

# Histogram for Delivery Time Distribution
@app.route('/api/delivery_time_distribution')
def delivery_time_distribution():
    query = """
    SELECT julianday(delivery_date) - julianday(order_date) as DeliveryTime
    FROM sales
    WHERE order_date IS NOT NULL AND delivery_date IS NOT NULL
    """
    result = query_db(query)
    data = {'delivery_times': [row['DeliveryTime'] for row in result]}
    return jsonify(data)

# Scatter Plot for Delivery Times Over Time
@app.route('/api/delivery_time_scatter')
def delivery_time_scatter():
    query = """
    SELECT strftime('%Y-%m', order_date) as Month, 
           julianday(delivery_date) - julianday(order_date) as DeliveryTime
    FROM sales
    WHERE order_date IS NOT NULL AND delivery_date IS NOT NULL
    ORDER BY Month
    """
    result = query_db(query)
    data = {'months': [row['Month'] for row in result], 'delivery_times': [row['DeliveryTime'] for row in result]}
    return jsonify(data)

# 4. Difference in Average Order Value (AOV) for Online vs. In-Store Sales:
# Box Plot for AOV Comparison
# Bar Chart for AOV Comparison
@app.route('/api/aov_comparison')
def aov_comparison():
    query = """
    SELECT 
        CASE 
            WHEN store_id IS NULL THEN 'online' 
            ELSE 'in_store' 
        END as sale_type,
        quantity * unit_price_usd as total_price
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    """
    result = query_db(query)
    
    # Convert result to DataFrame
    sales = pd.DataFrame(result, columns=['sale_type', 'total_price'])
    
    # Calculate AOV for online and in-store sales
    online_aov = sales[sales['sale_type'] == 'online']['total_price']
    in_store_aov = sales[sales['sale_type'] == 'in_store']['total_price']
    
    data = {
        'online': online_aov.tolist(),
        'in_store': in_store_aov.tolist(),
        'online_avg': online_aov.mean(),
        'in_store_avg': in_store_aov.mean()
    }
    
    return jsonify(data)


# Violin Plot for AOV Comparison
@app.route('/api/aov_violin_comparison')
def aov_violin_comparison():
    query = """
    SELECT 
        CASE 
            WHEN store_id IS NULL THEN 'online' 
            ELSE 'in_store' 
        END as sale_type,
        quantity * unit_price_usd as total_price
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    """
    result = query_db(query)
    
    # Convert result to DataFrame
    sales = pd.DataFrame(result, columns=['sale_type', 'total_price'])
    
    # Calculate AOV for online and in-store sales
    online_aov = sales[sales['sale_type'] == 'online']['total_price']
    in_store_aov = sales[sales['sale_type'] == 'in_store']['total_price']
    
    data = {
        'online': online_aov.tolist(),
        'in_store': in_store_aov.tolist()
    }
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)