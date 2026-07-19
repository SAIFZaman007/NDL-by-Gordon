FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE
ARG VITE_DASHBOARD_URL
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_DASHBOARD_URL=$VITE_DASHBOARD_URL
RUN npm run build

FROM nginx:alpine
RUN echo 'server {\n    listen 3000;\n    server_name _;\n    root /usr/share/nginx/html;\n    index index.html;\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
