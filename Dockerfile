FROM node:18-bookworm-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies like prisma CLI)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# ==========================================
# Production Stage
# ==========================================
FROM node:18-bookworm-slim AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy the generated Prisma client from the builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy application source code
COPY . .

# Install OpenSSL — required by Prisma's debian-openssl-3.0.x query engine binary.
# node:18-bookworm-slim does not include libssl3 by default; this provides libssl.so.3.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Set a non-root user for security
# node:18-bookworm-slim (Debian 12) — uses standard groupadd/useradd
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port (default 3000 — consistent with env.js and docker-compose.yml)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
