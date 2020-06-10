FROM node:9.5.0

# Create a /diffy directory that will contain the application's code
RUN mkdir -p /diffy/backend
RUN mkdir -p /diffy/frontend

# Frontend
COPY ./frontend/package.json /diffy/frontend/
WORKDIR /diffy/frontend
# Angular stuff (cli and dev)
RUN npm install -g @angular/cli

# Backend
COPY ./backend/package.json /diffy/backend/
WORKDIR /diffy/backend
RUN npm install -g clang-format

# By default expose port 3000 and run `node /diffy/src/app.js` when executing the image
EXPOSE 3000
CMD ["npm", "start"]
