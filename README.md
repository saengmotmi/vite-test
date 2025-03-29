# Vite Todo App

Feature Sliced Design(FSD) 아키텍처를 적용한 Todo 애플리케이션입니다.

## 기술 스택

- **Frontend**: React, Vite, TypeScript
- **상태 관리**: TanStack Query (React Query)
- **스타일링**: Tailwind CSS
- **API**: REST API (Port 3000)

## 주요 기능

- Todo 항목 추가/수정/삭제
- Todo 완료 상태 변경
- 반응형 UI 디자인

## 아키텍처 (FSD)

프로젝트는 Feature Sliced Design 원칙에 따라 구성되어 있습니다:

- `app/`: 앱 설정, 전역 스타일, 프로바이더
- `processes/`: 비즈니스 프로세스
- `pages/`: 페이지 컴포넌트
- `widgets/`: 독립적인 복합 컴포넌트
- `features/`: 사용자 인터랙션
- `entities/`: 비즈니스 엔티티
- `shared/`: 공유 유틸리티, UI, API, 모델

## 실행 방법

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 테스트 실행
yarn test
```

## 백엔드 API

Todo API는 `http://localhost:3000`에서 실행되어야 합니다.

### 엔드포인트:

- `GET /todos`: 모든 할 일 가져오기
- `GET /todos/:id`: 특정 할 일 가져오기
- `POST /todos`: 새 할 일 추가
- `PATCH /todos/:id`: 할 일 업데이트
- `DELETE /todos/:id`: 할 일 삭제

## 라이센스

MIT
