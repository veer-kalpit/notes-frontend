# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (if using a build step)
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "preview"]
