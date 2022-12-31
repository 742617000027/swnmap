FROM nginx:1.23.3-alpine

# Move in our website
COPY html /usr/share/nginx/html
