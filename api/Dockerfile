# Use Node.js 22.16.0 slim as the base image for a small footprint
FROM node:22.16.0-slim AS base

# Setup pnpm, corepack, and OpenSSL (required for Prisma)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# --- Stage 1: Build Stage ---
FROM base AS build
WORKDIR /usr/src/app

# Dummy DATABASE_URL to satisfy Prisma during build/install
ENV DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# Copy root monorepo configuration (using wildcards to prevent errors if some files are missing)
COPY pnpm-lock.yaml* pnpm-workspace.yaml* package.json* .npmrc* ./

# Copy individual package.json files
COPY api/package.json ./api/
COPY web/package.json* ./web/

# Install ALL dependencies (including devDependencies) for the build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# Copy the rest of the source code
COPY . .

# Generate Prisma Client
WORKDIR /usr/src/app/api
RUN pnpm prisma generate

# Build the NestJS application
RUN pnpm run build

# --- Stage 2: Production Dependencies Stage ---
FROM base AS prod-deps
WORKDIR /usr/src/app

# Copy configuration and only the API package.json
COPY pnpm-lock.yaml* pnpm-workspace.yaml* package.json* .npmrc* ./
COPY api/package.json ./api/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# --- Stage 3: Runner Stage ---
FROM node:22.16.0-slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy production node_modules and package.json from the prod-deps stage
COPY --from=prod-deps /usr/src/app/api/node_modules ./node_modules
COPY --from=prod-deps /usr/src/app/api/package.json ./package.json

# Copy built application and generated prisma client from the build stage
COPY --from=build /usr/src/app/api/dist ./dist
COPY --from=build /usr/src/app/api/generated ./generated
COPY --from=build /usr/src/app/api/prisma ./prisma

# Expose the API port
EXPOSE 4000

# Start the application
CMD ["node", "dist/main.js"]
