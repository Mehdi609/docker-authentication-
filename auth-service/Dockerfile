
FROM node:18

WORKDIR /app



RUN apt-get update && apt-get install -y \
    default-mysql-client \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["node", "src/server.js"]