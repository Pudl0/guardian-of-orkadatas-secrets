# Use latest node
FROM node:latest

# Create and init workdir
RUN mkdir -p /guardian
WORKDIR /guardian

# Copy package.json and install packages
COPY package.json /guardian/
RUN npm install

# Copy root dir from project
COPY . /guardian/

# Run build and start the bot
RUN npm run build
RUN npm run deploy-commands
CMD ["npm", "run", "start"]