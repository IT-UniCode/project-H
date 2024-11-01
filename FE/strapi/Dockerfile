# Вказуємо базовий образ Node.js
FROM node:20-alpine

# Встановлюємо глобально pm2 для керування процесом
RUN npm install -g pm2

# Встановлюємо залежності для керування правами доступу
RUN apk add --no-cache python3 g++ make

# Створюємо робочу директорію для нашого додатку
WORKDIR /app

# Копіюємо файли package.json і package-lock.json (або yarn.lock)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо всі файли проекту в контейнер
COPY . .

# Вказуємо порт, який використовує Strapi (типово 1337)
EXPOSE 1337

# Встановлюємо змінні середовища, якщо необхідно
ENV NODE_ENV=production

# Будуємо проект
RUN npm run build

# Запускаємо Strapi з використанням PM2
# CMD ["npm", "run", "start"]
CMD ["pm2-runtime", "start", "npm", "--", "start"]
