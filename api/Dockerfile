# Install dependencies
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Build the application
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client + build NestJS
RUN pnpm build

# Prune dev dependencies for production
RUN pnpm prune --prod

# Production runner
FROM node:20-alpine AS runner

WORKDIR /app

# Use non-root user for security
USER node

# Copy production node_modules
COPY --from=build --chown=node:node /app/node_modules ./node_modules

# Copy generated Prisma client
COPY --from=build --chown=node:node /app/generated ./generated

# Copy compiled application
COPY --from=build --chown=node:node /app/dist ./dist

# Copy Prisma schema (needed at runtime for Prisma client)
COPY --from=build --chown=node:node /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
