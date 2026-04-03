FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./

RUN npm install

# Copy all other backend files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["node", "server.js"]
