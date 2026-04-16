FROM node:18-alpine

WORKDIR /app

# Correct path (ROOT)
COPY package*.json ./
RUN npm install

# Copy everything
COPY . .

EXPOSE 3000

CMD ["npm", "start"]