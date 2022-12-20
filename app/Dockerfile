# Use a Node 16 base image
FROM node:16-alpine AS development
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
#RUN npm run build
# Set the env to "development"
ENV NODE_ENV development
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
#CMD [ "npx", "serve", "build" ]
CMD [ "npm", "start" ]

#docker build . -t dockerized-react-charity
#docker images | grep dockerized-react-charity
#docker run -p 3000:3000 -d dockerized-react-charity