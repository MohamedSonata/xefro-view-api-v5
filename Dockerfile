# Creating multi-stage build for production
FROM node:18-alpine as build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1
ENV NODE_ENV=production

WORKDIR /opt/
COPY package.json ./
RUN yarn global add node-gyp
RUN yarn config set network-timeout 600000 -g && yarn install --production
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN yarn build

# Creating final production image
FROM node:18-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production

WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH=/opt/node_modules/.bin:$PATH

# Ensure the "node" user owns the application directory and set permissions
RUN chown -R node:node /opt/app
RUN chmod -R 755 /opt/app

# Specifically give the "node" user write permissions to the uploads directory
RUN mkdir -p /opt/app/public/uploads && \
    chown -R node:node /opt/app/public/uploads && \
    chmod -R 775 /opt/app/public/uploads

# Switch to the "node" user
USER node
EXPOSE 1339
CMD ["yarn", "start"]
