
# Tony Lekehien Media Scraper

## Overview
This project is a web scraper designed to extract media (images, videos) from a list of URLs using Puppeteer, and store the results in a database. The backend is designed to run in Docker containers for scalability and easy deployment.

### Features
- Scrapes URLs for images and videos.
- Saves media to a database.
- Runs in Docker for scalability.

## Prerequisites
Before running this project, ensure you have the following installed:

- **Docker**: To build and run the containers.
- **Docker Compose**: For managing multi-container Docker applications.

## Guide

### Step 1: Clone the Project
```bash
git clone https://github.com/hienleke/tony_lekehien_mediaScraper.git
cd tony_lekehien_mediaScraper
```

### Step 2: Build Docker Containers
Run the following command to build the Docker containers:
```bash
docker-compose build
```

### Step 3: Run Docker Containers
Once the build is complete, start the containers in detached mode:
```bash
docker-compose up -d
```
This will start both the backend and frontend containers.

### Main UI
- Access the main UI at: [http://localhost:3000/](http://localhost:3000/)
  - Username: `admin`
  - Password: `password`

### API Test Example
After running the server, you can test the scraper API by sending a POST request to the following endpoint:

- **Endpoint**: `http://localhost:3001/api/scrape`
- **Request Body Example** (get the JWT token before using the URL):
  ```json
  {
    "urls": [
      "https://www.nytimes.com",
      "https://www.theguardian.com",
      "https://timesofindia.indiatimes.com",
      "https://www.wsj.com",
      "https://www.lemonde.fr"
    ]
  }
  ```

**Response**:
The server will return a JSON object with the URLs and the scraped media (images, videos) from those pages.

## Directories
- **media-scraper-backend**: Contains the backend code for scraping and interacting with the database.
- **media-scraper-frontend**: Contains the frontend code, if needed.
- **docker-compose.yml**: Docker Compose file for setting up backend, frontend, and database services.

## Folder Structure
```
.
├── .gitignore
├── docker-compose.yml
├── media-scraper-frontend/
└── media-scraper-backend/
```

## Scaling the Scraper for 5000 URLs

### Problem:
Running 5000 URLs simultaneously can be resource-intensive, especially on a server with 1 CPU and 1 GB RAM. Dynamic websites require a headless browser (e.g., Puppeteer), which consumes more resources than static websites. Scraping all URLs at once can overwhelm the system, leading to crashes or performance degradation.

### Solution:
#### Internal Queue and Worker Model:
Since scraping involves Puppeteer running inside Docker and interacting with a PostgreSQL database, it can overload the system. Therefore, external queues like Redis, Kafka, or RabbitMQ are not recommended, as they add complexity and consume more resources. Instead, an internal queue system will manage the URLs, controlling the number of URLs processed at a time, reducing the load and ensuring sequential task execution without overloading resources.

#### Worker Pool:
Create a pool of 10-20 workers to handle URLs in manageable batches. Each worker processes one URL at a time and, once finished, pulls the next URL from the queue. This prevents excessive resource consumption and enables handling large numbers of URLs efficiently.

#### Batch Processing:
Instead of attempting to scrape all 5000 URLs at once, break the URLs into smaller batches (e.g., 100 URLs per batch). This will allow the system to process URLs over time, distributing resource usage and preventing overload.
