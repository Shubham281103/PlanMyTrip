# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Install bash, netcat, and postgresql-client
RUN apt-get update && apt-get install -y bash netcat-openbsd postgresql-client && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# We use --no-cache-dir to reduce layer size
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code to the working directory
COPY . .

# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# The command to run the application will be in docker-compose.yml
# But we can expose the port here
EXPOSE 8000 