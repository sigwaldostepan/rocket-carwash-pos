# Use Node.js 22.16.0 slim as the base image for a small footprint
FROM node:22.16.0-slim AS base

# Setup pnpm, corepack, and OpenSSL (required for Prisma)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# --- Stage 1: Build ---
FROM base AS build
WORKDIR /usr/src/app

# Dummy DATABASE_URL to satisfy Prisma during build/install
ENV DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# Copy root monorepo configuration (using wildcards to prevent errors if some files are missing)
COPY pnpm-lock.yaml* pnpm-workspace.yaml* package.json* .npmrc* ./

# Copy individual package.json files (needed for pnpm to resolve workspaces)
COPY api/package.json ./api/
COPY web/package.json* ./web/

# Install all dependencies (including devDependencies for build)
# We use --ignore-scripts to prevent Prisma from failing before the schema is copied
# We use a cache mount for pnpm to speed up subsequent builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# Now copy the rest of the source code
COPY . .

# Generate Prisma Client
# This needs to happen before 'nest build'
WORKDIR /usr/src/app/api
RUN pnpm prisma generate

# Build the NestJS application
RUN pnpm run build

# Use pnpm deploy to create a pruned production directory for the API
# This creates a folder at /app with only the API package and its production dependencies
WORKDIR /usr/src/app
RUN pnpm --filter pirang-api deploy --legacy /app

# --- Stage 2: Production Runtime ---
FROM node:22.16.0-slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the pruned production folder from the deploy step
# This includes the package.json and node_modules
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Copy the built application and generated prisma client from the build stage
COPY --from=build /usr/src/app/api/dist ./dist
COPY --from=build /usr/src/app/api/generated ./generated
COPY --from=build /usr/src/app/api/prisma ./prisma

# Expose the API port (default is 4000 based on src/main.ts)
EXPOSE 4000

# Start the application using node directly
CMD ["node", "dist/main.js"]
