from flask import Flask, jsonify, render_template
import sqlite3
import pandas as pd
import random

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
def home():  
    return render_template("home.html")

# 1. Types of Products Sold and Customer Locations:

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
    SELECT city, state, country, continent, latitude, longitude, COUNT(*) as count
    FROM customers
    GROUP BY city, state, country
    """
    result = query_db(query)
    data = [{'city': row['city'], 'state': row['state'], 'country': row['country'], 'continent': row['continent'],
             'latitude': row['latitude'], 'longitude': row['longitude'], 'count': row['count']} for row in result]
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
    
    # Prepare data for violin plot
    data = {
        'online': sales[sales['sale_type'] == 'online']['total_price'].tolist(),
        'in_store': sales[sales['sale_type'] == 'in_store']['total_price'].tolist()
    }
    
    return jsonify(data)

@app.route('/index')
def index():  
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)