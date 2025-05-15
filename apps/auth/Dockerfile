FROM node:18

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 루트 패키지와 auth 앱 복사
COPY . .

# 의존성 설치 (루트 기준)
RUN pnpm install

# 빌드
RUN pnpm --filter auth build

# 실행
CMD ["pnpm", "--filter", "auth", "start:dev"]
