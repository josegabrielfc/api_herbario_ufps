FROM node:lts-alpine AS prod-deps
WORKDIR /app
COPY package*.json .
RUN npm ci

FROM prod-deps AS dev-deps
WORKDIR /app
RUN npm install

FROM dev-deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM prod-deps AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/uploads ./uploads
RUN npm install --only=production
EXPOSE 3000
VOLUME [ "/app/uploads/plants" ]
ENTRYPOINT [ "npm", "run", "start" ]