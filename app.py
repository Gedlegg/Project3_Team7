from flask import Flask, request, jsonify, render_template
import sqlite3
import pandas as pd
import numpy as np
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
    state = request.args.get('state')
    country = request.args.get('country')
    year = request.args.get('year')

    query = """
    SELECT strftime('%Y', sales.order_date) as year, 
           SUM(sales.quantity * products.unit_cost_usd) as total_cost, 
           SUM(sales.quantity * products.unit_price_usd) as total_revenue, 
           SUM(sales.quantity * products.unit_price_usd) - SUM(sales.quantity * products.unit_cost_usd) as profit,
           stores.state, stores.country,
           products.category, products.subcategory
    FROM sales 
    JOIN products ON sales.product_id = products.product_id
    JOIN stores ON sales.store_id = stores.store_id
    """

    filters = []
    if state:
        filters.append(f"stores.state = ?")
    if country:
        filters.append(f"stores.country = ?")
    if year:
        filters.append(f"strftime('%Y', sales.order_date) = ?")

    if filters:
        query += " WHERE " + " AND ".join(filters)

    query += """
    GROUP BY stores.state, stores.country, year, products.category, products.subcategory
    """

    # Log the query for debugging
    print(query)
    
    # Get the parameters for the query
    params = [param for param in (state, country, year) if param]

    result = query_db(query, params)
    data = [{'year': row['year'],
             'total_cost': '${:,.0f}'.format(row['total_cost']),
             'total_revenue': '${:,.0f}'.format(row['total_revenue']),
             'profit': '${:,.0f}'.format(row['profit']),
             'state': row['state'],
             'country': row['country'],
             'category': row['category'],
             'subcategory': row['subcategory']} for row in result]
    
    return jsonify(data)

# Customer Locations Map
@app.route('/api/customer_locations')
def customer_locations():
    query = """
    SELECT gender, city, state, country, continent, latitude, longitude, COUNT(*) as count
    FROM customers
    GROUP BY city, state, country
    """
    result = query_db(query)
    data = [{'gender': row['gender'],'city': row['city'], 'state': row['state'], 'country': row['country'], 'continent': row['continent'],
             'latitude': row['latitude'], 'longitude': row['longitude'], 'count': row['count']} for row in result]
    return jsonify(data)

@app.route('/api/customer_locations_cluster')
def customer_locations_cluster():
    query = """
    SELECT gender, city, state, country, continent, latitude, longitude, COUNT(*) as count
    FROM customers
    GROUP BY city, state, country
    """
    result = query_db(query)
    data = [{'gender': row['gender'],'city': row['city'], 'state': row['state'], 'country': row['country'], 'continent': row['continent'],
             'latitude': row['latitude'], 'longitude': row['longitude'], 'count': row['count']} for row in result]
    return jsonify(data)

@app.route('/api/store_location')
def store_location():
    state = request.args.get('state')
    country = request.args.get('country')
    year = request.args.get('year')

    query = """
    SELECT strftime('%Y', sales.order_date) as year, 
           SUM(sales.quantity * products.unit_cost_usd) as total_cost, 
           SUM(sales.quantity * products.unit_price_usd) as total_revenue, 
           SUM(sales.quantity * products.unit_price_usd) - SUM(sales.quantity * products.unit_cost_usd) as profit,
           stores.state, stores.country
    FROM sales 
    JOIN products ON sales.product_id = products.product_id
    JOIN stores ON sales.store_id = stores.store_id
    """

    filters = []
    if state:
        filters.append(f"stores.state = '{state}'")
    if country:
        filters.append(f"stores.country = '{country}'")
    if year:
        filters.append(f"strftime('%Y', sales.order_date) = '{year}'")
    
    if filters:
        query += " WHERE " + " AND ".join(filters)
    
    query += """
    GROUP BY stores.state, stores.country, year
    """

    print(query)  # Log the query for debugging
    
    result = query_db(query)
    data = [{'year': row['year'],
             'total_cost': '${:,.0f}'.format(row['total_cost']),
             'total_revenue': '${:,.0f}'.format(row['total_revenue']),
             'profit': '${:,.0f}'.format(row['profit']),
             'state': row['state'],
             'country': row['country']} for row in result]
    
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
@app.route('/api/yearly_order_distribution')
def yearly_order_distribution():
    query = """
    SELECT strftime('%Y', order_date) as year, strftime('%m', order_date) as month, strftime('%d', order_date) as day, COUNT(order_number) as order_count
    FROM sales
    GROUP BY year, month, day
    ORDER BY year, month, day
    """
    result = query_db(query)
    
    data = {}
    for row in result:
        year = row['year']
        month = row['month']
        day = row['day']
        order_count = row['order_count']
        if year not in data:
            data[year] = {}
        if month not in data[year]:
            data[year][month] = {}
        if day not in data[year][month]:
            data[year][month][day] = 0
        data[year][month][day] += order_count
    
    return jsonify(data)

@app.route('/api/seasonal_order_distribution')
def seasonal_order_distribution():
    query = """
    SELECT strftime('%Y', order_date) as year, 
           strftime('%m', order_date) as month, 
           COUNT(order_number) as order_count
    FROM sales
    GROUP BY year, month
    ORDER BY year, month
    """
    result = query_db(query)
    
    data = []
    for row in result:
        year = row['year']
        month = row['month']
        season = get_season(month)
        order_count = row['order_count']
        data.append({
            'year': year,
            'month': month,
            'season': season,
            'order_count': order_count
        })
    
    return jsonify(data)

@app.route('/api/available_years')
def available_years():
    query = """
    SELECT DISTINCT strftime('%Y', order_date) as year
    FROM sales
    ORDER BY year
    """
    result = query_db(query)
    years = [row['year'] for row in result]
    return jsonify(years)
  

@app.route('/api/yearly_revenue_distribution')
def yearly_revenue_distribution():
    query = """
    SELECT strftime('%Y', order_date) as year, strftime('%m', order_date) as month, strftime('%d', order_date) as day, SUM(quantity * unit_price_usd) as revenue
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    GROUP BY year, month, day
    ORDER BY year, month, day
    """
    result = query_db(query)
    
    data = {}
    for row in result:
        year = row['year']
        month = row['month']
        day = row['day']
        revenue = row['revenue']
        if year not in data:
            data[year] = {}
        if month not in data[year]:
            data[year][month] = {}
        if day not in data[year][month]:
            data[year][month][day] = 0
        data[year][month][day] += revenue
    
    return jsonify(data)

def get_season(month):
    if month in ['12', '01', '02']:
        return 'Winter'
    elif month in ['03', '04', '05']:
        return 'Spring'
    elif month in ['06', '07', '08']:
        return 'Summer'
    else:
        return 'Fall'
@app.route('/api/seasonal_revenue_distribution')
def seasonal_revenue_distribution():
    query = """
    SELECT strftime('%Y', order_date) as year, 
           strftime('%m', order_date) as month, 
           SUM(quantity * unit_price_usd) as revenue
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    GROUP BY year, month
    ORDER BY year, month
    """
    result = query_db(query)
    
    data = []
    for row in result:
        year = row['year']
        month = row['month']
        season = get_season(month)
        revenue = row['revenue']
        data.append({
            'year': year,
            'month': month,
            'season': season,
            'revenue': revenue
        })
    
    return jsonify(data)
# 3. Average Delivery Time in Days Over Time:

# Line Chart for Average Delivery Time
@app.route('/api/average_delivery_time')
def average_delivery_time(): # <WHERE store_id == 0 AND line_item == 1> to fetch only online orders and only one line item (one row of data) for a particular order_number
    query = """
    SELECT strftime('%Y-%m-%d', order_date) as o_date,
           strftime('%Y-%m', order_date) as o_month,
           julianday(delivery_date) - julianday(order_date) as DeliveryTime,
           currency_code as Currency
    FROM sales
    WHERE store_id == 0 AND line_item == 1
    ORDER BY o_date
    """
    result = query_db(query)
    data = [{'Order_month': row['o_month'], 'Delivery_time': row['DeliveryTime'], 'Currency': row['Currency']} for row in result]
    return jsonify(data)

# Histogram for Product-wise Delivery Time
@app.route('/api/product_wise_delivery_time')
def product_wise_delivery_time(): # <WHERE store_id == 0> to fetch only online orders
    query = """
    SELECT sales.product_id,
           ROUND(AVG(julianday(delivery_date) - julianday(order_date)), 2) as AvgDeliveryTime,
           product_name
    FROM sales JOIN products ON sales.product_id = products.product_id
    WHERE store_id == 0
    GROUP BY sales.product_id
    """
    result = query_db(query)
    data = [{'Product_name': row['product_name'], 'Avg_Delivery_times': row['AvgDeliveryTime']} for row in result]
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
# Count Comparison Route
@app.route('/api/aov_comparison_count/<year>')
def aov_comparison_count(year):
    if year == 'all':
        query = """
        SELECT 
            CASE 
                WHEN delivery_date IS NULL THEN 'in_store' 
                ELSE 'online' 
            END as sale_type,
            COUNT(sales.order_date) as order_count
        FROM sales
        JOIN products ON sales.product_id = products.product_id
        GROUP BY sale_type, order_date
        """
    else:
        query = f"""
        SELECT 
            CASE 
                WHEN delivery_date IS NULL THEN 'in_store' 
                ELSE 'online' 
            END as sale_type,
            COUNT(sales.order_date) as order_count
        FROM sales
        JOIN products ON sales.product_id = products.product_id
        WHERE strftime('%Y', order_date) = '{year}'
        GROUP BY sale_type, order_date
        """
    result = query_db(query)
    
    # Convert result to DataFrame
    sales = pd.DataFrame(result, columns=['sale_type', 'order_count'])
    
    # Separate counts for online and in-store
    online_counts = sales[sales['sale_type'] == 'online']['order_count'].tolist()
    in_store_counts = sales[sales['sale_type'] == 'in_store']['order_count'].tolist()
    
    data = {
        'online': online_counts,
        'in_store': in_store_counts
    }
    
    return jsonify(data)

# Bar Chart for AOV Comparison
# Revenue Comparison Route
@app.route('/api/aov_comparison_revenue')
def aov_comparison_revenue():
    query = """
    SELECT 
        CASE 
            WHEN delivery_date IS NULL THEN 'in_store' 
            ELSE 'online' 
        END as sale_type,
        strftime('%Y', sales.order_date) as year,
        SUM(quantity * unit_price_usd) as total_revenue
    FROM sales
    JOIN products ON sales.product_id = products.product_id
    GROUP BY sale_type, year
    """
    result = query_db(query)
    
    # Convert result to DataFrame
    sales = pd.DataFrame(result, columns=['sale_type', 'year', 'total_revenue'])
    
    # Group by year and sale_type
    grouped_sales = sales.groupby(['year', 'sale_type']).agg({'total_revenue': 'sum'}).reset_index()

    # Separate data for online and in-store
    online_data = grouped_sales[grouped_sales['sale_type'] == 'online'].set_index('year')['total_revenue'].tolist()
    in_store_data = grouped_sales[grouped_sales['sale_type'] == 'in_store'].set_index('year')['total_revenue'].tolist()

    # Calculate averages
    online_avg = grouped_sales[grouped_sales['sale_type'] == 'online']['total_revenue'].mean()
    in_store_avg = grouped_sales[grouped_sales['sale_type'] == 'in_store']['total_revenue'].mean()

    # Convert NaN to None for averages
    online_avg = online_avg if not np.isnan(online_avg) else None
    in_store_avg = in_store_avg if not np.isnan(in_store_avg) else None

    # Prepare data dictionary
    data = {
        'years': grouped_sales['year'].unique().tolist(),
        'online': online_data,
        'in_store': in_store_data,
        'online_avg': online_avg,
        'in_store_avg': in_store_avg
    }
    
    return jsonify(data)
# Violin Plot for AOV Comparison
@app.route('/api/aov_violin_comparison/<year>')
def aov_violin_comparison(year):
    if year == 'all':
        query = """
        SELECT 
            CASE 
                WHEN delivery_date IS NULL THEN 'in_store' 
                ELSE 'online' 
            END as sale_type,
            SUM(quantity * unit_price_usd) as total_revenue
        FROM sales
        JOIN products ON sales.product_id = products.product_id
        GROUP BY sale_type, order_date
        """
    else:
        query = f"""
        SELECT 
            CASE 
                WHEN delivery_date IS NULL THEN 'in_store' 
                ELSE 'online' 
            END as sale_type,
            SUM(quantity * unit_price_usd) as total_revenue
        FROM sales
        JOIN products ON sales.product_id = products.product_id
        WHERE strftime('%Y', order_date) = '{year}'
        GROUP BY sale_type, order_date
        """
    result = query_db(query)
    
    # Convert result to DataFrame
    sales = pd.DataFrame(result, columns=['sale_type', 'total_revenue'])
    
    # Separate revenues for online and in-store
    online_revenues = sales[sales['sale_type'] == 'online']['total_revenue'].tolist()
    in_store_revenues = sales[sales['sale_type'] == 'in_store']['total_revenue'].tolist()
    
    data = {
        'online': online_revenues,
        'in_store': in_store_revenues
    }
    
    return jsonify(data)

@app.route('/index')
def index():  
    return render_template("index.html")
@app.route('/gg1')
def gg1():  
    return render_template("gg1.html")
@app.route('/gg3')
def gg3():  
    return render_template("gg3.html")
@app.route('/gg2')
def gg2():  
    return render_template("gg2.html")
@app.route('/suad1')
def suad1():  
    return render_template("suad1.html")
@app.route('/suad2')
def suad2():  
    return render_template("suad2.html")
@app.route('/suad3')
def suad3():  
    return render_template("suad3.html")
@app.route('/willy1')
def willy1():  
    return render_template("willy1.html")
@app.route('/willy2')
def willy2():  
    return render_template("willy2.html")
@app.route('/willy3')
def willy3():  
    return render_template("willy3.html")
@app.route('/harshh1')
def harshh1():  
    return render_template("harshh1.html")
@app.route('/harshh2')
def harshh2():  
    return render_template("harshh2.html")
@app.route('/suadg1')
def suadg1():  
    return render_template("suadg1.html")
@app.route('/cover')
def cover():  
    return render_template("cover.html")
@app.route('/api')
def api():  
    return render_template("api.html")


if __name__ == '__main__':
    app.run(debug=True)