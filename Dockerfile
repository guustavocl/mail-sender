FROM node:18-alpine AS alpine

FROM alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile;

# Rebuild the source code only when needed
FROM alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/build ./build
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
RUN chown -R expressjs:nodejs /app
USER expressjs
EXPOSE 3000
CMD ["yarn", "start"]

# create image with this command: sudo docker build . -t mail-sender-image
# run container with this command: sudo docker run -d --restart=unless-stopped --name mail-sender --network npm mail-sender-image