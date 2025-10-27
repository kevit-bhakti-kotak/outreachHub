FROM node:24
 
WORKDIR /app
 
COPY package*.json ./
 
# Install all dependencies (including dev) for build
RUN npm install
 
COPY . .
 
# Build the app (needs Nest CLI + TypeScript)
RUN npm run build
 
# Remove dev dependencies to slim image
# RUN npm prune --production

# Set environment to development (if needed)
ENV NODE_ENV=development
 
EXPOSE 2000
CMD ["npm", "run" , "start:dev"]