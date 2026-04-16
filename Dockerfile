FROM node:18-alpine

WORKDIR /app

COPY Florenza-Custom-Style-1/package*.json ./
RUN npm install

COPY Florenza-Custom-Style-1/ .

EXPOSE 3000

CMD ["npm", "start"]