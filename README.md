# Project3_Team7

# Global Electronic Sales Data Analysis

This repository contains the code and documentation for various analyses performed on sales data. The analyses are divided into different tasks handled by specific team members, each focusing on distinct aspects of the data to provide comprehensive insights.

## Table of Contents

1. Analysis and Visualization
2. Project Collaborators
3. File Structure
4. Prerequisites
5. Running the Dashboard
6. Usage
7. Links for Data Source and Citations

## Analysis and Visualization

* **Product Performance**: Evaluate the performance of different products across various regions.
* **Customer Insights**: Analyze customer demographics and purchasing patterns.
* **Store Analysis**: Assess the performance of stores based on location and other factors.
* **Time Series Analysis**: Track sales and revenue trends over different periods.
* **Product wise Delivery Times**: Assess product-wise average delivery time over different periods and for different regions.
* **Sales Channel Comparison**: Compare revenue and order volume between different sales channels (online vs. in-store).

## Project Collaborators

###### Product Revenue Distribution, Customer Location, and Revenue by Store Location Analysis

* Contributor for Gedlegeorgis Geda
* Tools: Stacked column chart, Geographic cluster and marker maps, Gender distribution pie charts, Stacked column chart.

###### Seasonal Patterns or Trends Analysis

* Contributor Willy Negreiros
* Tools: Line charts, Heat maps, Box plots.

###### Average Delivery Time (in Days) Over Time

* Contributor Harshh Patel
* Tools: Line chart, Bar chart.

###### Sales Channel Analysis

* Contributor Suad Godax
* Tools: Box plot, Cluster column chart, Violin plot.

## File Structure

###### Output

- `customers.csv`: Processed customer data.
- `products.csv`: Processed product data.
- `stores.csv`: Processed store data.
- `sales.csv`: Processed sales data.

###### Resource

- `Customers_with_coordinates.csv`: Raw customer data with coordinates.
- `Customers.csv`: Raw customer data.
- `lon_lan.csv`: Longitude and latitude data.
- `Products.csv`: Raw product data.
- `Sales.csv`: Raw sales data.
- `Stores.csv`: Raw store data.

###### Static

- `css/styles.css`: Stylesheets for the dashboard.
- `image/bg5.jpg`: Background image used in the dashboard.
- `image/logo4.png`: Logo image used in the dashboard.
- `scripts.js`: JavaScript file for the dashboard's interactive features.

###### Templates

- `api.html`: Template for API documentation.
- `cover.html`: Cover page template.
- `gg1.html`: Template for a specific analysis (replace with actual description).
- `gg2.html`: Template for a specific analysis (replace with actual description).
- `gg3.html`: Template for a specific analysis (replace with actual description).
- `willy1.html`: Template for a specific analysis (replace with actual description).
- `willy2.html`: Template for a specific analysis (replace with actual description).
- `willy3.html`: Template for a specific analysis (replace with actual description).
- `harshh1.html`: Template for a specific analysis (replace with actual description).
- `harshh2.html`: Template for a specific analysis (replace with actual description).
- `suad1.html`: Template for a specific analysis (replace with actual description).
- `suad2.html`: Template for a specific analysis (replace with actual description).
- `home.html`: Home page template.
- `index.html`: Main index page for the dashboard.

###### Root Directory

- `.gitignore`: Git ignore file specifying files and directories to be ignored by Git.
- `app.py`: Main application script for running the Flask server.
- `config.py`: Configuration file for the Flask application.
- `data.ipynb`: Jupyter Notebook containing data processing and analysis scripts.
- `Project 3 Presentation.ppt`: Project presentation file.
- `sales_dashboard.sqlite`: SQLite database file containing processed data.
- `README.md`: This README file.

## Prerequisites

To view the visualizations require the user to

- ensure you have Python installed on your system.
- install Flask and all its dependencies like request, jsonify, render_template, and other python librarie like sqlite3, pandas, numpy, random.

## Running the Dashboard

1. Clone this repository to your local machine.
2. Navigate to the project directory
3. Start the Flask serve
4. Open your web browser and go to `http://127.0.0.1:5000` to view the dashboard.

## Usage

* **Year Selection:**
  * Use the year selector to choose the year for which you want to view the data.
  * The plots will update automatically based on the selected year.
* **Sales Channel Comparison:**
  * The bar chart provides a comparison of revenue between in-store and online sales across different years.
* **Average Delivery Times:**
  * The line plot shows the trend in delivery times over the months.
  * Use the region selector to filter the data by specific regions..

# Links for Data Source and Citations

https://stackoverflow.com/questions/158474/how-to-obtain-longitude-and-latitude-for-a-street-address-programmatically-and

https://opencagedata.com/api

https://www.kaggle.com/datasets/bhavikjikadara/global-electronics-retailers
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_sidenav_fixed

https://getbootstrap.com

https://fontawesome.com

https://unsplash.com/photos/pen-on-paper-6EnTPvPPL6I
