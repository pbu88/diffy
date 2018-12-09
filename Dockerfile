FROM node:latest

# Create a /diffy directory that will contain the application's code
RUN mkdir -p /diffy/backend

# Install app dependencies
COPY ./backend/package.json /diffy/backend/

WORKDIR /diffy/backend

# Install the dependencies from `packages.json`
RUN npm install


# By default expose port 3000 and run `node /diffy/src/app.js` when executing the image
EXPOSE 3000
CMD ["npm", "start"]
