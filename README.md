# Web Scraper Chrome Extension

## Overview

The **Web Scraper Chrome Extension** is a powerful tool designed to extract essential content from web pages quickly and efficiently. With the ability to scrape titles, body text, images, headers, subheaders, and links, this extension provides users with the data they need for analysis, research, or content creation.

## Features

- **Title Extraction**: Capture the title of the web page.
- **Body Text Scraping**: Retrieve all text content from the body of the page.
- **Image URLs**: Collect URLs of all images displayed on the page.
- **Headers and Subheaders**: Extract all headers (h1, h2, h3) for better content structuring.
- **Links Collection**: Gather all hyperlinks present on the page for easy access.
- **User-Friendly Interface**: Intuitive and simple to use, designed for users of all skill levels.

## Installation

### Prerequisites

- Google Chrome or any Chromium-based browser
- Node.js and npm

### Clone the Repository

```bash
git clone https://github.com/yourusername/web-scraper.git
```
```bash
cd web-scraper
```
# Install Dependencies
```bash
npm install
```
# Build the Extension
```bash
npm run build
```
# Load the Extension
Open Chrome and go to chrome://extensions/.
Enable "Developer mode" by toggling the switch in the upper right corner.
Click "Load unpacked" and select the dist folder of the project.
# Usage
Click the Web Scraper icon in your Chrome toolbar.
Navigate to the web page you want to scrape.
Click the "Scrape Page" button in the extension popup.
View the extracted data displayed in the popup.
# API Integration
The scraped data can be sent to a server for further processing. The default server endpoint is set to http://localhost:5000/scrape. Ensure you have a Flask backend running to handle the scraped data.

# Flask Backend Setup
To set up the backend, follow these steps:

Navigate to the backend directory.

Install Flask and CORS:

```bash
pip install Flask flask-cors
```
# Run the Flask server:

```bash
python app.py
```
# Contributing
We welcome contributions to improve the Web Scraper Chrome Extension! To contribute:

# Fork the repository.
Create a new branch:
```bash
git checkout -b feature/YourFeature
```
Make your changes and commit them:
```bash
git commit -m "Add your message"
```
# Push to the branch:
```bash

git push origin feature/YourFeature
```
Create a pull request.
# License
This project is licensed under the MIT License. See the LICENSE file for details.

# Acknowledgments
Inspired by web scraping tools and technologies.
Special thanks to the open-source community for their invaluable contributions.
