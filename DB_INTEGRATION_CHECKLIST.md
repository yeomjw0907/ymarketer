# DB 연동 체크리스트

> 📅 작성일: 2026-01-28  
> 📌 모든 기능의 DB 연동 상태 확인

---

## ✅ DB 연동 완료

### 1. 상품 관련
- ✅ **상품 목록** (`app/page.tsx`)
  - DB: `products` 테이블
  - 연동 상태: 완료
  
- ✅ **상품 상세** (`app/product/[id]/page.tsx`)
  - DB: `products` 테이블
  - 연동 상태: 완료

- ✅ **찜하기** (`components/product/FavoriteButton.tsx`) 
  - DB: `favorites` 테이블
  - 연동 상태: 완료 (추가/삭제)
  
### 2. 주문 관련
- ✅ **주문 생성** (`app/api/orders/route.ts`)
  - DB: `orders` 테이블
  - 연동 상태: 완료

- ✅ **주문 내역** (`app/mypage/orders/page.tsx`)
  - DB: `orders`, `products` 테이블 (JOIN)
  - 연동 상태: 완료

- ✅ **결제 처리** (`app/api/payment/confirm/route.ts`)
  - DB: `orders` 테이블 (상태 업데이트)
  - 연동 상태: 완료

### 3. 사용자 관련
- ✅ **회원가입** (`app/signup/page.tsx`)
  - DB: `auth.users`, `profiles` 테이블
  - 연동 상태: 완료 (트리거로 자동 생성)

- ✅ **로그인/로그아웃**
  - DB: Supabase Auth
  - 연동 상태: 완료

- ✅ **프로필 수정** (`app/mypage/settings/page.tsx`)
  - DB: `profiles` 테이블
  - 연동 상태: 완료

- ✅ **회원 탈퇴** (`app/api/user/delete/route.ts`)
  - DB: `auth.users` (Admin API), `profiles` 등 CASCADE 삭제
  - 연동 상태: 완료

### 4. 리뷰 관련
- ✅ **리뷰 작성** (`components/product/ReviewForm.tsx`)
  - DB: `reviews` 테이블
  - 연동 상태: 완료

- ✅ **리뷰 목록** (`components/product/ReviewList.tsx`)
  - DB: `reviews`, `profiles` 테이블 (JOIN)
  - 연동 상태: 완료

- ✅ **도움됨 표시** (`components/product/ReviewList.tsx`)
  - DB: `review_helpful` 테이블
  - 연동 상태: 완료

### 5. 게시판 관련 (NEW! ✨)
- ✅ **FAQ** (`app/mypage/faq/page.tsx`)
  - DB: `faqs` 테이블
  - 연동 상태: 완료 ✅ DB에서 가져옴

- ✅ **공지사항** (`app/mypage/notice/page.tsx`)
  - DB: `notices` 테이블
  - 연동 상태: 완료 ✅ DB에서 가져옴

- ✅ **이벤트** (`app/mypage/events/page.tsx`)
  - DB: `events` 테이블
  - 연동 상태: 완료 ✅ DB에서 가져옴

### 6. 관리자 페이지
- ✅ **상품 관리** (`app/admin/products/page.tsx`)
  - DB: `products` 테이블
  - 연동 상태: 완료 (CRUD)

- ✅ **주문 관리** (`app/admin/orders/page.tsx`)
  - DB: `orders` 테이블
  - 연동 상태: 완료 (상태 변경)

- ✅ **배너 관리** (`app/admin/banners/page.tsx`)
  - DB: `hero_banners` 테이블
  - 연동 상태: 완료 (CRUD)

- ✅ **설정 관리** (`app/admin/settings/page.tsx`)
  - DB: `global_settings` 테이블
  - 연동 상태: 완료 (업데이트)

---

## 🆕 추가된 기능

### 1. 찜하기 버튼
- **위치**: 상품 상세 페이지 구매 버튼 옆
- **기능**:
  - 하트 아이콘 클릭으로 찜 추가/제거
  - 로그인 필요 (비로그인 시 로그인 페이지로 이동)
  - 토스트로 결과 알림
  - 찜 상태에 따라 하트 색상 변경 (빨강/회색)
- **DB**: `favorites` 테이블

### 2. 게시판 DB 연동
- **파일**: `supabase-board-tables.sql`
- **테이블**:
  - `notices` (공지사항)
  - `faqs` (FAQ)
  - `events` (이벤트)
- **기능**:
  - 각 테이블에 `is_visible`, `sort_order` 필드
  - RLS 정책 (누구나 조회, 인증된 사용자만 수정)
  - 샘플 데이터 포함

### 3. 회원 탈퇴 API
- **파일**: `app/api/user/delete/route.ts`
- **기능**:
  - Supabase Admin API로 사용자 삭제
  - 관련 데이터 자동 삭제 (CASCADE)
  - 세션 종료 및 홈으로 리다이렉트

---

## 📋 DB 테이블 목록

| 테이블명 | 용도 | 연동 여부 | RLS |
|---------|------|-----------|-----|
| `products` | 상품 | ✅ | ✅ |
| `orders` | 주문 | ✅ | ✅ |
| `profiles` | 사용자 프로필 | ✅ | ✅ |
| `favorites` | 찜 | ✅ | ✅ |
| `reviews` | 리뷰 | ✅ | ✅ |
| `review_helpful` | 리뷰 도움됨 | ✅ | ✅ |
| `hero_banners` | 메인 배너 | ✅ | ✅ |
| `global_settings` | 전역 설정 | ✅ | ✅ |
| `notices` | 공지사항 | ✅ | ✅ |
| `faqs` | FAQ | ✅ | ✅ |
| `events` | 이벤트 | ✅ | ✅ |

---

## 🚀 DB 설정 방법

### 1. 기본 테이블 생성
```bash
# Supabase SQL Editor에서 실행
1. supabase-schema.sql (기본 스키마)
2. supabase-reviews.sql (리뷰 시스템)
3. supabase-favorites.sql (찜 기능)
4. supabase-add-quantity.sql (주문 수량)
5. supabase-board-tables.sql (게시판) ✨ NEW
```

### 2. 샘플 데이터 추가
```bash
# Supabase SQL Editor에서 실행
supabase-seed.sql (상품 샘플 데이터)
```

### 3. Storage 버킷 생성
- `product-images` (상품 이미지)
- `review-images` (리뷰 이미지)

---

## ⚠️ 추가 작업 필요

### 1. 관리자 페이지 (게시판 CRUD)
현재 **마이페이지에서는 DB를 읽기만** 하고, **관리자 페이지에서 관리**해야 합니다.

추가할 페이지:
- `/admin/notices` - 공지사항 관리
- `/admin/faqs` - FAQ 관리
- `/admin/events` - 이벤트 관리

각 페이지 기능:
- 목록 조회
- 추가/수정/삭제
- 노출 여부 토글
- 정렬 순서 변경

**참고**: `app/admin/products/page.tsx`를 참고하여 비슷하게 구현하면 됩니다.

### 2. 관리자 대시보드 메뉴 추가
`app/admin/dashboard/page.tsx`의 메뉴에 다음 항목 추가:
- 공지사항 관리
- FAQ 관리
- 이벤트 관리

---

## 🎯 체크리스트

- [x] 상품 DB 연동
- [x] 주문 DB 연동
- [x] 사용자 DB 연동
- [x] 찜하기 기능 추가
- [x] 리뷰 DB 연동
- [x] FAQ DB 연동
- [x] 공지사항 DB 연동
- [x] 이벤트 DB 연동
- [x] 회원 탈퇴 API 추가
- [ ] 관리자 페이지 (공지사항 CRUD)
- [ ] 관리자 페이지 (FAQ CRUD)
- [ ] 관리자 페이지 (이벤트 CRUD)

---

## 📝 정리

### 완료된 항목
1. ✅ 상품 상세 페이지에 찜하기 버튼 추가 (데스크톱 + 모바일)
2. ✅ 마이페이지 FAQ, 공지사항, 이벤트 DB 연동
3. ✅ 회원 탈퇴 API 구현 (실제 DB 삭제)
4. ✅ 게시판 테이블 SQL 스크립트 작성

### 남은 작업
1. ⏳ 관리자 페이지에서 공지사항/FAQ/이벤트 CRUD 구현
2. ⏳ 관리자 대시보드 메뉴에 링크 추가

**예상 작업 시간**: 2-3시간 (각 CRUD 페이지 약 1시간씩)

---

**작성일**: 2026-01-28  
**작성자**: AI Assistant  
**버전**: 1.0
