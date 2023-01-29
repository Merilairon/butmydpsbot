FROM node:16

# Copy all source code
COPY . .


RUN npm install

ENTRYPOINT ["npm", "start"]