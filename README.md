# Price Check (얼마면 돼?)

일본 직구 가격 비교 플랫폼 - Next.js 14 + Supabase

## 🚀 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase-schema.sql` 파일 내용을 실행
3. Storage에서 `product-images` 버킷 생성 (Public으로 설정)
4. `.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

5. Supabase 프로젝트의 API 키를 `.env.local`에 입력:
   - Project Settings > API > URL 복사
   - Project Settings > API > anon/public key 복사
   - Project Settings > API > service_role key 복사 (관리자용)

6. **(선택)** 더미 상품 데이터 추가: SQL Editor에서 `supabase-seed.sql` 파일 내용을 복사 후 실행하면 캠핑·골프·패션·뷰티·전자기기 등 16개 샘플 상품이 추가됩니다. 메인 페이지와 관리자 페이지에서 바로 확인할 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 📦 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

## 🗂️ 프로젝트 구조

```
price-check/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   ├── product/[id]/      # 상품 상세
│   └── admin/             # 관리자 대시보드
├── components/            # React 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── product/          # 상품 관련 컴포넌트
│   └── admin/            # 관리자 컴포넌트
├── lib/                   # 유틸리티 & 설정
│   ├── supabase/         # Supabase 클라이언트
│   ├── utils/            # 유틸리티 함수
│   └── types/            # TypeScript 타입
└── supabase-schema.sql   # 데이터베이스 스키마

## 🎯 핵심 기능

### 1. 가격 계산기
- 일본 가격(엔화) → 원화 환산
- 관부가세 자동 계산 ($150 초과 시 18%)
- 무게 기반 배송비 계산
- 구매대행 수수료 10%
- 실시간 절약 금액 표시

### 2. 비회원 주문
- 회원가입 없이 주문 가능
- 이름, 전화번호, 주소만 입력
- 주문 즉시 접수

### 3. 관리자 대시보드
- Supabase Auth 로그인 필수
- 상품 CRUD (이미지 업로드)
- 주문 관리 (상태 변경)
- 환율 설정 업데이트

## 🧮 가격 계산 공식

```typescript
// 1. 상품 원화 환산
item_krw = jp_price * yen_rate

// 2. 관부가세 (과세 기준: 200,000원)
tax = item_krw > 200000 ? item_krw * 0.18 : 0

// 3. 배송비 (기본 1kg: 15,000원, 0.5kg당 5,000원 추가)
shipping = 15000 + (weight > 1 ? Math.ceil((weight - 1) * 2) * 5000 : 0)

// 4. 수수료
fee = item_krw * 0.10

// 5. 최종 가격
final_price = item_krw + tax + shipping + fee

// 6. 절약 금액
saved = kr_price - final_price
```

## 📱 페이지 구성

- `/` - 메인 페이지 (상품 리스트)
- `/product/[id]` - 상품 상세 & 주문
- `/admin` - 관리자 로그인
- `/admin/dashboard` - 관리자 대시보드
- `/admin/products` - 상품 관리
- `/admin/orders` - 주문 관리

## 🎨 디자인 컨셉

- **레퍼런스**: KREAM (크림) + Toss
- **컬러**: 
  - Primary: Blue (#2563EB) - 신뢰감
  - Success: Green (#16A34A) - 절약/이득
  - Destructive: Red (#EF4444) - 경고
- **폰트**: Pretendard (시스템 폰트 대체)
- **모바일 우선** 반응형 디자인

## 📝 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🚢 배포

자세한 배포 가이드는 `DEPLOYMENT.md` 파일을 참조하세요.

### 간단 배포 (Vercel)

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

**중요**: Vercel에서 환경 변수를 반드시 설정해야 합니다!

## 🎯 프로젝트 완성도

### ✅ 완료된 기능

- [x] Next.js 14 App Router 기반 프로젝트 구조
- [x] Supabase PostgreSQL 데이터베이스 스키마
- [x] 실시간 가격 계산기 (환율, 관세, 배송비, 수수료)
- [x] 메인 페이지 (Hero Section + 상품 그리드)
- [x] 상품 상세 페이지 (가격 비교 패널)
- [x] 비회원 주문 시스템 (회원가입 불필요)
- [x] 관리자 인증 (Supabase Auth)
- [x] 관리자 대시보드 (통계 표시)
- [x] 상품 관리 (CRUD + 이미지 업로드)
- [x] 주문 관리 (목록, 상태 변경)
- [x] 전역 설정 관리 (환율, 배송비, 세율 등)
- [x] 반응형 디자인 (모바일 우선)
- [x] KREAM + Toss 스타일 UI/UX

### 🎨 디자인 하이라이트

- **Pretendard** 폰트로 깔끔한 한글 타이포그래피
- **Blue (#2563EB)** 신뢰감 있는 브랜드 컬러
- **Green (#16A34A)** 절약 금액 강조
- **모바일 Sticky CTA** 구매 전환율 최적화
- **애니메이션 효과** 절약 금액 배지에 pulse 효과

### 💡 핵심 비즈니스 로직

가격 계산 공식이 정확히 구현되었습니다:

```
최종 가격 = 상품가(엔화→원화) + 관세(18%) + 배송비 + 수수료(10%)
절약 금액 = 한국 최저가 - 최종 가격
```

## 🧪 테스트 방법

### 1. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

### 2. Supabase 설정 확인

1. `.env.local` 파일에 API 키 입력
2. `supabase-schema.sql` 실행
3. Storage에 `product-images` 버킷 생성
4. 관리자 계정 생성

### 3. 테스트 시나리오

1. **메인 페이지**: 카테고리 필터링 확인
2. **상품 상세**: 가격 계산이 정확한지 확인
3. **주문하기**: 비회원 주문이 정상적으로 접수되는지 확인
4. **관리자 로그인**: `/admin`에서 로그인
5. **상품 등록**: 이미지 업로드 포함 상품 추가
6. **주문 관리**: 주문 목록 및 상태 변경
7. **환율 수정**: 설정 페이지에서 환율 변경 후 메인 페이지 확인

## 🐛 알려진 이슈 & 해결 방법

### Supabase Storage 설정

Storage 버킷을 **Public**으로 설정해야 이미지가 표시됩니다.

### Next.js Image 최적화

Supabase Storage 도메인이 `next.config.ts`에 추가되어 있습니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issue를 등록해주세요.

## 📄 라이센스

Private Project

---

Made with ❤️ using Next.js 14 + Supabase
