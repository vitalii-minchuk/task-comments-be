# FROM node:18

# WORKDIR /usr/src/app

# COPY prisma ./prisma

# COPY package.json package-lock.json ./

# RUN npm install

# COPY prisma/schema.prisma ./prisma/

# RUN npx prisma generate

# COPY . .

# RUN npm run build

# EXPOSE 4004

# CMD ["npm", "run", "start"]