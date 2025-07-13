# 1. Node.js 공식 이미지 기반
FROM node:20

# 2. 작업 디렉토리 생성
WORKDIR /app

# 3. 의존성 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스 복사
COPY . .

# 5. 앱 실행
CMD ["npm", "start"]

# 6. 포트 설정
EXPOSE 3000
