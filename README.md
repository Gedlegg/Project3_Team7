# Project3_Team7

# Global Electronic Sales Data Analysis

This repository contains the code and documentation for various analyses performed on sales data. The analyses are divided into different tasks handled by specific team members, each focusing on distinct aspects of the data to provide comprehensive insights.

## Table of Contents

1. Analysis and Visualization
2. Use Cases and Analysis Contributions
3. File Structure
4. Complete Work Cited

## Analysis and Visualization

### Product Revenue Distribution, Customer Location, and Revenue by Store Location Analysis

**Tasked for Gedlegeorgis Geda**

#### Tools Used

* **Stacked Bar Chart:** Visualizes revenue distribution by product category and subcategory.
* **Geographic Cluster and Marker Maps:** Uncover geographic insights of customer locations.
* **Gender Distribution Pie Charts:** Illustrates gender distribution across various regions.
* **Top and Bottom Performing Stores Table:** Shows the best and worst-performing stores.

### Seasonal Patterns or Trends Analysis

**Tasked for Willy Negreiros**

#### Tools Used

* **Line Charts:** Visualize trends in order volume and revenue by year.
* **Heat Maps:** Show order volume and revenue distributions over months and years.
* **Box Plots:** Compare revenues and order volumes across seasons or months.

### Average Delivery Time in Days Over Time

**Tasked for Harshh Patel**

#### Tools Used

* **Line Charts:** Track changes in average delivery time over time.
* **Bar Chart:** Product wise delivery time.

### Sales Channel Analysis

**Tasked for Suad Godax**

#### Tools Used

* **Box Plots:** Compare average order volumes by sales channel.
* **Bar Charts:** Visualize seasonal revenue distribution by sales channel.
* **Violin Plots:** Compare revenue distributions by sales channel.

## File Structure

Global Electronic-data-analysis/
│
├── Output/
│   ├── customers.csv
│   ├── products.csv
│   ├── stores.csv
│   └── sales.csv
│
├── Resource/
│   ├── Customers_with_coordinates.csv
│   ├── Customers.csv
│   ├── lon_lan.csv
│   ├── Products.csv
│   ├── Sales.csv
│   └── Stores.csv
│
├── Static/
│   ├── css/styles.css
│   ├── image/bg5.jpg
│   ├── image/logo4.png
│   └── scripts.js
│

├── templates/
│   ├── api.html
│   ├── cover.html
│   ├── gg1.html
│   ├── gg2.html
│   ├── gg3.html
│   ├── willy1.html
│   ├── willy2.html
│   ├── willy3.html
│   ├── harshh1.html
│   ├── harshh2.html
│   ├── suad1.html
│   ├── suad2.html
│   ├── home.html
│   └── index.html
│
├── .gitignore
├── app.py
├── config.py
├── data.ipynb
├── Project 3 Presentation.ppt
├── sales_dashboard.sqlite
└── README.md

# Dependencies/Installallations

Dependencies to view the visualizations require the user to download and install Flask and all its dependencies like Flask, request, jsonify, render_template, and other python librarie like sqlite3, pandas, numpy, random.

# Links for Data Source and Citations

https://stackoverflow.com/questions/158474/how-to-obtain-longitude-and-latitude-for-a-street-address-programmatically-and

https://opencagedata.com/api

https://www.kaggle.com/datasets/bhavikjikadara/global-electronics-retailers
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_sidenav_fixed

https://getbootstrap.com

https://fontawesome.com
