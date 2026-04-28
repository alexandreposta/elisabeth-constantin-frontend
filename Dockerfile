FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Variables d'environnement build-time (Vite les inline dans le bundle).
# Aucune valeur sensible : VITE_STRIPE_PUBLIC_KEY est une clé publishable Stripe,
# VITE_CLOUDINARY_* est un cloud name + un upload preset unsigned public.
ARG VITE_API_URL=http://localhost:8000
ARG VITE_STRIPE_PUBLIC_KEY=pk_test_replace_me
ARG VITE_CLOUDINARY_CLOUD_NAME=
ARG VITE_CLOUDINARY_UPLOAD_PRESET=

ENV VITE_API_URL=$VITE_API_URL \
    VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY \
    VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME \
    VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET

RUN npm run build

FROM nginx:1.27-alpine

RUN apk upgrade --no-cache

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
