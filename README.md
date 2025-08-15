<img src = "https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/content/Frame+561.png">

> 인디밴드 노래를 하루 한 곡씩 주고받으며 함께 디깅하고 즐기는 팬 커뮤니티 플랫폼, **밴놀(Bandnol)** 서버 레파지토리입니다.
<br>
<br>

## Main Features (주요 기능)
<img src = "https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/content/introduction.png">

## Team Members (팀원 및 팀 소개)
| 강다현 | 김나영 | 임지은 |
|:------:|:------:|:------:|
| <img src="https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/profile/KakaoTalk_20250529_174914622.jpg.png" alt="강다현" width="150"> | <img src="https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/profile/44E22A8C-7406-4749-9DF1-A4A8D6E77DA4_1_102_o.jpeg" alt="김나영" width="150"> | <img src="https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/profile/IMG_8629.jpg" alt="임지은" width="150"> |
| BE | BE | BE |
| [@dadang6842](https://github.com/dadang6842) | [@kny2383](https://github.com/kny2383) | [@wldmsdl7](https://github.com/wldmsdl7) 
<br>

## Tech Skill (기술 스택) 
### Skills
<div>

[![My Skills](https://skillicons.dev/icons?i=nodejs,js,express,postgres,prisma,redis)](https://skillicons.dev)

</div>

### Infra
<div>

[![My Skills](https://skillicons.dev/icons?i=aws,docker,githubactions)](https://skillicons.dev)
</div>

### Tools
<div>

[![My Skills](https://skillicons.dev/icons?i=github,git,notion,postman,discord,bots,figma)](https://skillicons.dev)
</div>

<br>


## System Architecutre (시스템 아키텍처)
<img src = "https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/content/Frame+2.png"></img>

<br>

## Branch Strategy (브랜치 전략)
<img src = "https://bandnol-be-profile.s3.ap-northeast-2.amazonaws.com/content/gitflow.png">

### Git Flow 사용 이유
- 많은 인원이 동시에 작업할 때 브랜치 역할을 명확히 구분하여 충돌 최소화  
- 기능별 개발, 버그 수정, 긴급 패치, 배포 준비 단계가 분리되어 있어 체계적인 관리 가능  
- 협업과 배포 프로세스가 원활해짐  
- 안정적인 배포와 빠른 긴급 대응 가능  
- 각 브랜치의 목적과 흐름이 명확하여 유지보수가 쉬움  

### 브랜치 종류
- **main**: 실제 배포 코드  
- **dev**: 개발 통합 브랜치  
- **feature/[기능명]**: 기능 개발  
- **fix/[버그명]**: 버그 수정  
- **release/[버전]**: 배포 준비  
- **hotfix/[이슈명]**: 긴급 수정  

### 규칙
1. 브랜치명은 **kebab-case** 사용 (예: `feature/get-user`)  
2. 기능 개발은 `feature` → `dev` → (`release`) → `main` 순으로 병합
    - 상황에 따라 release는 생략 가능
3. 버그 수정은 `fix` 또는 `hotfix` 브랜치 사용  
4. 긴급 수정은 `hotfix` → `main` 병합  

<br>



## Project Structure (프로젝트 구조)
```plaintext
project/
├── assets/                           # README.md 작성 시 사용하는 이미지들
├── .github/
│   ├── ISSUE_TEMPLATE/               # GitHub 이슈 템플릿
│   ├── workflows/                    # GitHub Actions 워크플로우 정의 파일
│   └── pull_request_template.md      # PR(풀 리퀘스트) 템플릿
├── node_modules/                     # 설치된 npm 패키지
├── prisma/                           # Prisma 스키마 및 마이그레이션 파일
├── src/
│   ├── components/                   # 재사용 가능한 swagger 성공/실패 응답 파일
│   ├── configs/                      # 환경설정 및 설정 관련 파일
│   ├── controllers/                  # 컨트롤러
│   ├── cron/                         # 스케줄러/크론잡 관련 파일
│   ├── dtos/                         # DTO들 (응답, 요청 형식)
│   ├── middlewares/                  # 미들웨어들
│   ├── repositories/                 # DB 접근 로직 (쿼리문)
│   ├── routes/                       # API 라우팅 정의
│   ├── services/                     # 비즈니스 로직
│   ├── utils/                        # 유틸리티 함수 (토큰, redis 관련)
│   ├── errors.js                     # 에러 클래스 및 처리 로직
│   └── index.js                      # 서버 진입점
├── package.json                      # 프로젝트 종속성 및 스크립트
├── package-lock.json                  # 종속성 버전 고정 파일
├── .gitignore                         # Git 무시 목록
├── Dockerfile                         # Docker 빌드 설정
└── README.md                          # 프로젝트 개요 및 사용 방법
```


