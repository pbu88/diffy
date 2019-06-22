FROM node:9.5.0

# Create a /diffy directory that will contain the application's code
RUN mkdir -p /diffy/backend
RUN mkdir -p /diffy/frontend

# Frontend dependencies
COPY ./frontend/package.json /diffy/frontend/
WORKDIR /diffy/frontend
RUN npm install

# Angular stuff (cli and dev)
RUN npm install -g @angular/cli

# Backend dependencies
COPY ./backend/package.json /diffy/backend/
WORKDIR /diffy/backend
RUN npm install

COPY ./backend /diffy/backend/
COPY ./frontend /diffy/frontend/

WORKDIR /diffy/frontend
RUN npm run-script build

# By default expose port 3000 and run `node /diffy/src/app.js` when executing the image
EXPOSE 3000
WORKDIR /diffy/backend

COPY ./ /diffy/
CMD ["npm", "start"]
