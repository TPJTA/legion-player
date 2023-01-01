FROM node:latest as build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i
COPY . .
RUN pnpm build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html