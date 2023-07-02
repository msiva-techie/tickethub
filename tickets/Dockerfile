FROM node:18-bullseye-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
CMD ["npm", "run", "start-dev"]
