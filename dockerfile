FROM node:16.17-alpine

# Create an app directory in the docker
WORKDIR /app

# Prepare
COPY . ./
RUN npm ci --workspaces
RUN npm run build --workspaces
# Note: prisma generate would run as part of the postinstall
EXPOSE 8080

# Run the server
CMD node server/dist/server.js
