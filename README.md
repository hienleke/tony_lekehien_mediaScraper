# Tony Lekehien Media Scraper

## Overview

This project is a web scraper built to extract media (images, videos) from a list of URLs using Puppeteer and store the results in a database. The backend is designed to run in Docker containers for scalability and ease of deployment.

### Features
- Scrapes URLs for images and videos.
- Saves media to a database.
- Designed to be run in Docker for scalability.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Docker**: To build and run the containers.
- **Docker Compose**: For managing multi-container Docker applications.

## Guide


```bash
Step 1: Clone project
git clone https://github.com/hienleke/tony_lekehien_mediaScraper.git
cd tony_lekehien_mediaScraper

Step 2: Build Docker Containers

Run the following command to build the Docker containers:

docker-compose build


Step 3: Run Docker Containers
Once the build is complete, start the containers in detached mode:

docker-compose up -d

This will start both the backend and frontend containers.
### Features
  Main ui  ->    http://localhost:3000/              with user_name  : 'admin'  password : 'password'

    API Test Example
    After running the server, you can test the scraper API by sending a POST request to the following endpoint:

            Endpoint: http://localhost:3001/api/scrape
            
            Request Body Example: pls  get  the jwt  token before using this url
            
            {
                "urls": [
                    "https://www.nytimes.com",
                    "https://www.theguardian.com",
                    "https://timesofindia.indiatimes.com",
                    "https://www.wsj.com",
                    "https://www.lemonde.fr"
                ]
            }
      *Response
      The server will return a JSON object with the URLs and the scraped media (images, videos) from those pages.


     *Directories

        media-scraper-backend: Contains the backend code for scraping and interacting with the database.
        media-scraper-frontend: Contains the frontend code, if needed.
        docker-compose.yml: Docker Compose file for setting up backend, frontend, and database services.
     *Folder Structure
    .
    ├── .gitignore
    ├── docker-compose.yml
    ├── media-scraper-frontend/
    └── media-scraper-backend/


*Scaling the Scraper for 5000 URLs

*To scale the scraper to handle approximately 5000 URLs at the same time on a server with 1 CPU and 1 GB RAM, consider the following solution:

      Problem
          Running 5000 URLs simultaneously in a backend scraper that handles both dynamic and static websites can be resource-intensive, especially on servers with limited resources such as 1 CPU and 1GB of RAM. Dynamic websites require a headless browser (e.g.,         
          Puppeteer) to render JavaScript and fully scrape the content, which consumes more resources than static website scraping. Handling all these URLs at once can overwhelm the system, leading to potential crashes or significant performance degradation.

    Solution
        Internal Queue and Worker Model
        Since scraping requires using Puppeteer running as a Chrome mini inside Docker and also with Docker Backend  and postgres database, this can load the system. Therefore, external queues like Redis, Kafka, or RabbitMQ should not be used, as they would increase              complexity and consume more resources.
         While cloud services could optimize this, it's not the current solution approach, so I choose to use a small internal queue within the code to handle the tasks. This internal queue will control the number of URLs processed at a time, reducing system load and            ensuring tasks are performed sequentially without overloading resources
        To efficiently manage this task, an internal queue system can be implemented to manage the URLs. This approach helps avoid overwhelming the system by processing smaller batches of URLs rather than scraping all 5000 URLs simultaneously.

    Worker Pool
        Create a pool of workers (e.g., 10-20 workers) that handle the URLs in manageable batches. Each worker processes one URL at a time and, once finished, pulls the next URL from the queue. This ensures that the system can handle a large number of URLs while         
         preventing excessive resource consumption.

    Batch Processing
            Instead of attempting to scrape all 5000 URLs at once, break the URLs into smaller batches (e.g., 100 URLs per batch). This allows the system to process the URLs over time, spreading out the resource usage and preventing overload.
