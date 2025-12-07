# Image Node nhẹ
FROM node:22-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy file package để cài deps trước
COPY package*.json ./

# Cài dependency
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port app (nhớ trùng với PORT bạn dùng trong code/.env)
EXPOSE 3000

# Lệnh chạy (dev mode, dùng ts-node-dev)
CMD ["npm", "run", "dev"]
