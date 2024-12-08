# Frontend Dockerfile

# Step 1: Build the frontend app
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app with a static file server
FROM nginx:alpine

# Copy the build output from the previous step
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000 for the frontend
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
