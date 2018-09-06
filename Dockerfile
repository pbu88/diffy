FROM node:latest

# Create a /diffy directory that will contain the application's code
RUN mkdir -p /diffy

# Install app dependencies
COPY package.json /diffy

WORKDIR /diffy

# Install the dependencies from `packages.json`
RUN npm install

# By default expose port 3000 and run `node /diffy/src/app.js` when executing the image
EXPOSE 3000
CMD ["npm", "run", "v2_start"]
