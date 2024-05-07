#!/bin/sh
# entrypoint.sh

# Run Prisma migrations
pnpm prisma migrate dev --name init

# Start your application
exec pnpm run start:dev
