# --------- Stage 1: Build Stage ---------
FROM node:18 AS build
WORKDIR /app

# Copy package.json and package-lock.json separately for layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies like vite)
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app (make sure vite is available)
RUN npm run build

# --------- Stage 2: Nginx Serve Stage ---------
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if exists
COPY nginx.conf /etc/nginx/conf.d/default.conf
