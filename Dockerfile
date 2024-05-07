FROM node:18

WORKDIR /app

COPY package*.json ./

# Install pnpm
RUN npm install -g pnpm

RUN pnpm install

COPY . .
COPY entrypoint.sh /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

# Prisma
RUN pnpm prisma generate

RUN pnpm run build

# dev
CMD [ "pnpm", "run", "start:dev" ]