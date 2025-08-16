# back_end/Dockerfile
FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY .env ./
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]



# # Stage 1: Builder
# FROM node:20.11.1-alpine3.20 AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production

# COPY . .

# # Optional: obfuscate the code
# RUN npm install -g javascript-obfuscator \
#     && javascript-obfuscator . --output dist --compact true --self-defending true

# # Stage 2: Production (only obfuscated code)
# FROM node:20.11.1-alpine3.20 AS production

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production

# # Copy only obfuscated build
# COPY --from=builder /app/dist .

# EXPOSE 3000

# CMD ["node", "index.mjs"]
