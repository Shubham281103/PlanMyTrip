# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and other configuration files
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install any needed packages
ARG CACHE_DATE=not-a-date
RUN echo "Cache bust: $CACHE_DATE" && npm install

# Copy the rest of the application's code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"] 