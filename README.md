# DateMate 🗓️

그룹의 일정을 가장 쉽게 조율하는 웹 서비스

## ✨ 주요 기능

- 🚀 **로그인 없이 바로 시작**: 복잡한 가입 절차 없이 이벤트 생성
- 📅 **날짜 투표**: 가능한 날짜를 클릭 한 번으로 선택
- 🏆 **실시간 결과**: 투표 현황이 실시간으로 반영되는 TOP 5
- 🔗 **간편한 공유**: 링크 하나로 모두가 참여 가능

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **UI Icons**: Lucide React
- **Date Utils**: date-fns

## 🚀 시작하기

### 1. Supabase 설정

`SUPABASE_SETUP.md` 파일을 참고하여 Supabase 프로젝트를 설정하세요.

### 2. 환경 변수 설정

`.env.local` 파일에 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요!

## 📖 사용 방법

1. **이벤트 생성**: "새 이벤트 만들기" 버튼 클릭
2. **정보 입력**: 이벤트 제목과 날짜 범위 설정
3. **링크 공유**: 생성된 링크를 친구들에게 공유
4. **투표 참여**: 링크를 받은 사람들이 가능한 날짜 선택
5. **결과 확인**: 실시간으로 업데이트되는 TOP 5 날짜 확인

## 📁 프로젝트 구조

```
datemate/
├── app/
│   ├── create/          # 이벤트 생성 페이지
│   ├── event/[id]/      # 이벤트 상세/투표 페이지
│   ├── page.tsx         # 랜딩 페이지
│   ├── layout.tsx       # 루트 레이아웃
│   └── globals.css      # 글로벌 스타일
├── lib/
│   └── supabase.ts      # Supabase 클라이언트 설정
└── public/              # 정적 파일
```

## 🎨 디자인 특징

- **그라데이션 배경**: Purple to Indigo 그라데이션
- **Glassmorphism**: 반투명 카드 디자인
- **Micro-interactions**: 호버 효과 및 애니메이션
- **반응형**: 모바일 & 데스크탑 최적화

## 📝 라이선스

MIT License
