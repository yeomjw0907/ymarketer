# 📸 카테고리 이미지 가이드

**작성일:** 2026-01-28  
**목적:** 카테고리 섹션에 사용할 이미지 준비 가이드

---

## 🎯 필요한 이미지 리스트

### 위치: `public/images/`

| 파일명 | 카테고리 | 권장 크기 | 비율 | 설명 |
|--------|----------|-----------|------|------|
| `category-all.png` | 전체 | 200x200px | 1:1 | 트렌딩/전체 상품 아이콘 |
| `category-camping.png` | 캠핑 | 200x200px | 1:1 | 텐트, 랜턴 등 캠핑 용품 |
| `category-golf.png` | 골프 | 200x200px | 1:1 | 골프채, 골프공 등 |
| `category-fashion.png` | 패션 | 200x200px | 1:1 | 옷, 신발 등 패션 아이템 |
| `category-beauty.png` | 뷰티 | 200x200px | 1:1 | 화장품, 향수 등 |
| `category-electronics.png` | 전자기기 | 200x200px | 1:1 | 스마트폰, 이어폰 등 |

---

## 📐 이미지 스펙

### 기본 요구사항
- **포맷:** PNG (누끼 따진 투명 배경)
- **크기:** 200x200px (정사각형)
- **해상도:** 72-150 DPI
- **용량:** 50KB 이하 (최적화)
- **배경:** 투명 (transparent)
- **스타일:** 미니멀, 깔끔한 일러스트

---

## 🎨 디자인 가이드라인

### 스타일
- **미니멀리즘:** 심플하고 명확한 형태
- **라인 아트:** 아웃라인이 뚜렷한 스타일
- **컬러:** 블랙 또는 그레이스케일 (호버 시 반전)
- **여백:** 충분한 padding (전체의 20% 정도)

### 각 카테고리별 추천 소재

#### 1. 전체 (category-all.png)
```
✅ 추천:
- 트렌딩 화살표 (↗)
- 별표 모음 (★★★)
- 그리드 패턴
- "ALL" 텍스트 + 아이콘

❌ 비추천:
- 너무 복잡한 디자인
```

#### 2. 캠핑 (category-camping.png)
```
✅ 추천:
- 텐트 실루엣
- 랜턴
- 캠핑파이어
- 배낭

❌ 비추천:
- 사진 느낌
- 너무 디테일한 일러스트
```

#### 3. 골프 (category-golf.png)
```
✅ 추천:
- 골프채 (드라이버)
- 골프공
- 깃발 (홀)
- 트로피

❌ 비추천:
- 골프 선수 실루엣
```

#### 4. 패션 (category-fashion.png)
```
✅ 추천:
- 티셔츠 행거
- 옷걸이
- 쇼핑백
- 신발 실루엣

❌ 비추천:
- 특정 브랜드 로고
```

#### 5. 뷰티 (category-beauty.png)
```
✅ 추천:
- 립스틱
- 향수병
- 화장품 용기
- 브러시

❌ 비추천:
- 사람 얼굴
- 특정 제품
```

#### 6. 전자기기 (category-electronics.png)
```
✅ 추천:
- 스마트폰
- 이어폰/헤드폰
- 노트북
- 충전기

❌ 비추천:
- 특정 제품 모델
- 브랜드 로고
```

---

## 🛠️ 제작 방법

### 방법 1: AI 이미지 생성 (추천)
```
프롬프트 예시:
"minimalist line art icon of camping tent, 
black and white, transparent background, 
simple clean design, PNG format, 200x200px"
```

**추천 도구:**
- DALL-E 3
- Midjourney
- Stable Diffusion
- Adobe Firefly

### 방법 2: 무료 아이콘 사이트
```
사이트:
- flaticon.com
- iconfinder.com
- noun project (the)
- icons8.com
```

**주의사항:**
- 라이센스 확인 필수!
- 상업적 이용 가능한지 체크
- 크레딧 표기 필요 여부 확인

### 방법 3: 직접 디자인
```
도구:
- Figma (무료)
- Adobe Illustrator
- Sketch
- Canva (무료)
```

---

## 📦 파일 최적화

### 1. 크기 조정
```bash
# ImageMagick 사용
magick convert input.png -resize 200x200 output.png
```

### 2. 용량 압축
```bash
# pngquant 사용
pngquant --quality=65-80 input.png --output output.png
```

### 3. 온라인 도구
- TinyPNG (tinypng.com)
- Squoosh (squoosh.app)
- CompressPNG (compresspng.com)

---

## 🚀 적용 방법

### 1. 이미지 파일 준비
```
public/
└── images/
    ├── category-all.png
    ├── category-camping.png
    ├── category-golf.png
    ├── category-fashion.png
    ├── category-beauty.png
    └── category-electronics.png
```

### 2. 파일 업로드
- 위 경로에 이미지 파일 저장
- 파일명 정확히 일치시키기 (대소문자 구분)

### 3. 확인
```bash
npm run dev
# 메인 페이지 접속 후 카테고리 섹션 확인
```

---

## 🎨 임시 대안 (이미지 없을 시)

현재는 이미지가 없어도 작동합니다:
- **대체:** 텍스트 라벨로 표시
- **에러 방지:** Next.js Image 컴포넌트가 처리
- **추후 교체:** 이미지 준비 후 업로드

---

## ✅ 체크리스트

### 이미지 준비 전
- [ ] 디자인 스타일 결정
- [ ] 제작 방법 선택 (AI/무료 소스/직접)
- [ ] 라이센스 확인

### 이미지 제작 중
- [ ] 200x200px 정사각형
- [ ] 투명 배경 (PNG)
- [ ] 블랙/그레이 컬러
- [ ] 미니멀 스타일
- [ ] 충분한 여백

### 이미지 제작 후
- [ ] 파일 크기 50KB 이하
- [ ] 파일명 정확히 일치
- [ ] `public/images/` 폴더에 저장
- [ ] 웹사이트에서 테스트

---

## 💡 프로 팁

### 1. 일관성 유지
- 모든 아이콘 같은 스타일
- 선 굵기 동일
- 여백 비율 통일

### 2. 호버 효과
- 현재: `scale-110` (10% 확대)
- 이미지에 충분한 여백 필요

### 3. 반응형
- 작은 화면에서도 명확
- 디테일 너무 많지 않게

### 4. 접근성
- `alt` 텍스트로 카테고리명 제공
- 이미지 로드 실패 시 대체 텍스트

---

## 🔮 추후 개선 아이디어

### 1. 다크모드 대응
- 별도 다크 버전 이미지
- CSS `filter: invert()` 활용

### 2. 애니메이션
- SVG 애니메이션
- Lottie 파일 사용

### 3. 계절별 변경
- 봄/여름/가을/겨울 테마
- 이벤트별 특별 아이콘

---

## 📞 도움이 필요하면

**AI 이미지 생성 프롬프트:**

```
Category: Camping
Prompt: "Create a minimalist black line art icon of a camping tent, 
transparent background, simple and clean design, 200x200px PNG, 
suitable for web interface, modern style"

Category: Golf
Prompt: "Create a minimalist black line art icon of a golf club and ball, 
transparent background, simple and clean design, 200x200px PNG, 
suitable for web interface, modern style"

(나머지 카테고리도 동일한 형식)
```

---

**작성자:** AI UX Designer  
**버전:** 1.0  
**상태:** 가이드 완성 ✅
