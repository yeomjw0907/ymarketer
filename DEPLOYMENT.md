# 배포 가이드 (Deployment Guide)

## 🚀 Vercel 배포

### 1. Vercel 계정 연결

```bash
npm install -g vercel
vercel login
```

### 2. 프로젝트 배포

```bash
vercel
```

첫 배포 시 몇 가지 질문에 답변:
- Set up and deploy: Y
- Which scope: (본인 계정 선택)
- Link to existing project: N
- Project name: price-check
- Directory: ./
- Override settings: N

### 3. 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 선택
2. Settings > Environment Variables
3. 다음 변수들 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 4. 프로덕션 배포

```bash
vercel --prod
```

---

## 📦 Supabase 설정

### 1. 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. "New Project" 클릭
3. 프로젝트 이름, 비밀번호, 지역 설정

### 2. 데이터베이스 스키마 생성

1. Supabase Dashboard > SQL Editor
2. `supabase-schema.sql` 파일 내용 복사
3. 실행 (Run)

### 3. Storage 버킷 생성

1. Supabase Dashboard > Storage
2. "New Bucket" 클릭
3. 버킷 이름: `product-images`
4. Public bucket: ✅ (체크)
5. Create

### 4. 관리자 계정 생성

1. Supabase Dashboard > Authentication > Users
2. "Add user" 클릭
3. 이메일/비밀번호 입력 (예: admin@pricecheck.kr)
4. Auto Confirm User: ✅ (체크)
5. Create

### 5. API Keys 확인

1. Supabase Dashboard > Project Settings > API
2. 다음 키들을 복사:
   - Project URL
   - anon/public key
   - service_role key (보안 주의!)

---

## 🔒 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `SUPABASE_SERVICE_ROLE_KEY`를 절대 클라이언트 코드에서 사용하지 않기
- [ ] Supabase RLS (Row Level Security) 정책이 활성화되어 있는지 확인
- [ ] 관리자 계정 비밀번호를 강력하게 설정
- [ ] Vercel 환경 변수가 올바르게 설정되어 있는지 확인

---

## 🧪 배포 후 테스트

### 필수 테스트 항목

1. **메인 페이지**
   - [ ] 상품 목록이 정상적으로 표시되는가?
   - [ ] 카테고리 필터가 작동하는가?
   - [ ] 환율이 표시되는가?

2. **상품 상세 페이지**
   - [ ] 가격 계산이 정확한가?
   - [ ] 이미지가 로드되는가?
   - [ ] 주문 폼이 작동하는가?

3. **관리자 페이지**
   - [ ] 로그인이 되는가?
   - [ ] 상품 등록/수정/삭제가 작동하는가?
   - [ ] 이미지 업로드가 작동하는가?
   - [ ] 주문 목록이 표시되는가?
   - [ ] 설정 변경이 저장되는가?

---

## 🐛 문제 해결 (Troubleshooting)

### "Failed to fetch" 에러
- Supabase URL과 API Key가 올바른지 확인
- 환경 변수가 `NEXT_PUBLIC_` 접두사를 포함하는지 확인

### 이미지가 표시되지 않음
- Storage 버킷이 Public으로 설정되어 있는지 확인
- `next.config.ts`에 Supabase 도메인이 추가되어 있는지 확인

### 관리자 로그인 실패
- Supabase에서 사용자가 생성되었는지 확인
- 이메일/비밀번호가 올바른지 확인

### 빌드 에러
```bash
# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

---

## 📊 성능 최적화

### 이미지 최적화
- 상품 이미지를 WebP 형식으로 변환 권장
- 이미지 크기를 1MB 이하로 유지

### 캐싱 설정
- Vercel은 자동으로 정적 에셋을 캐싱
- API 라우트는 필요시 `revalidate` 설정

### 데이터베이스 최적화
- 인덱스가 올바르게 생성되었는지 확인 (SQL 스키마에 포함)
- 쿼리 성능 모니터링

---

## 📈 모니터링

### Vercel Analytics
- Vercel Dashboard에서 Analytics 활성화
- 페이지 뷰, 성능 지표 확인

### Supabase Monitoring
- Supabase Dashboard > Database > Query Performance
- API 사용량 확인

---

## 🔄 업데이트 배포

코드 변경 후:

```bash
git add .
git commit -m "Update: 기능 추가"
git push origin main
```

Vercel이 자동으로 배포를 시작합니다.

---

## 📞 지원

문제가 발생하면:
1. Vercel 로그 확인
2. Supabase 로그 확인
3. 브라우저 개발자 도구 콘솔 확인

행운을 빕니다! 🎉
