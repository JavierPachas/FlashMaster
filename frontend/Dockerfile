# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g vite

COPY . .

EXPOSE 3000

CMD ["/usr/local/bin/vite", "dev", "--host", "0.0.0.0"]
