# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build
#CMD ["npm", "run", "start"]
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]

#docker build . -t dockerized-react-charity
#docker images | grep dockerized-react-charity
#docker run -p 3000:3000 -d dockerized-react-charity