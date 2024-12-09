# Step 1: Use Node.js base image to build and run the React app
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package.json package-lock.json ./

# Install dependencies (this is done before copying the rest of the code)
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable to change the default port for React app to 3000
ENV PORT 3000

# Expose port 3000 for the React app
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]
