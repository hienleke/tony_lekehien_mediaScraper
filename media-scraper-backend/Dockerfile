# Step 1: Use Node.js to build and run the backend
FROM node:18

# Install dependencies for Puppeteer to run properly
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    chromium \
    libxss1 \
    libgconf-2-4 \
    libnss3 \
    libgtk-3-0 \
    --no-install-recommends

# Set the working directory for the backend
WORKDIR /app

RUN ls -la /
# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for the backend
EXPOSE 3001

# Set Puppeteer-specific environment variables and launch with required flags
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Run the backend app with Puppeteer properly configured
CMD ["npm", "start"]
