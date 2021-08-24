FROM node:16.7.0

# Create a /diffy directory that will contain the application's code
RUN mkdir -p /diffy/backend
RUN mkdir -p /diffy/frontend

RUN npm install -g typescript@2.6.2
# Angular stuff (cli and dev)
RUN npm install -g @angular/cli@7.0.2

# Frontend
COPY ./frontend/package.json /diffy/frontend/
WORKDIR /diffy/frontend

# Backend
COPY ./backend/package.json /diffy/backend/
WORKDIR /diffy/backend
RUN npm install -g clang-format

# By default expose port 3000 and run `node /diffy/src/app.js` when executing the image
EXPOSE 3000
CMD ["npm", "start"]
