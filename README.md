# 📱 폰싸게 - 안전한 휴대폰 구매 플랫폼

> 신뢰할 수 있는 대리점에서 합리적인 가격으로 휴대폰을 구매할 수 있는 플랫폼

## 🚀 주요 기능

### ✨ 사용자 기능
- **맞춤형 딜 검색**: 지역, 통신사별 필터링
- **사용자 타입별 추천**: 일반 성인, 시니어, 미성년자
- **실시간 예약 시스템**: 간편한 온라인 예약
- **안전한 회원 관리**: 이메일 인증 및 정보 보호

### 🏪 대리점 기능 (개발 예정)
- **딜 등록/관리**: 실시간 가격 및 재고 업데이트
- **예약 관리**: 고객 예약 확인 및 상태 관리
- **매출 분석**: 판매 통계 및 리포트

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - 반응형 디자인
- **Vanilla JavaScript** - ES5 호환성

### Backend & Database
- **Supabase** - 실시간 데이터베이스
- **PostgreSQL** - 관계형 데이터베이스
- **Row Level Security** - 데이터 보안

### 배포
- **GitHub** - 소스코드 관리
- **Netlify** - 정적 사이트 호스팅

## 📁 프로젝트 구조

```
phone-deals-app/
├── index.html          # 메인 HTML 파일
├── css/
│   └── styles.css      # 전체 스타일시트
├── js/
│   ├── app.js          # 메인 애플리케이션 로직
│   ├── data.js         # 딜 데이터 관리
│   ├── supabase.js     # 데이터베이스 연동
│   └── utils.js        # 공통 유틸리티 함수
└── README.md           # 프로젝트 문서
```

## 🔧 설치 및 실행

### 1. 리포지토리 클론
```bash
git clone https://github.com/your-username/phone-deals-app.git
cd phone-deals-app
```

### 2. Supabase 설정 (선택사항)
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `js/supabase.js` 파일에서 다음 값 변경:
```javascript
var SUPABASE_URL = 'https://your-project-id.supabase.co';
var SUPABASE_ANON_KEY = 'your-anon-key';
```

### 3. 로컬 실행
```bash
# 간단한 HTTP 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js 사용
npx serve .

# 브라우저에서 http://localhost:8000 접속
```

## 🌐 배포

### Netlify 배포
1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 선택
3. GitHub 리포지토리 연결
4. 자동 배포 완료!

## 📊 데이터베이스 스키마

### users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  birth_date DATE,
  user_type VARCHAR DEFAULT 'adult',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### stores 테이블
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  phone VARCHAR,
  verified BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### deals 테이블
```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  phone_model VARCHAR NOT NULL,
  carrier VARCHAR NOT NULL,
  original_price INTEGER NOT NULL,
  discounted_price INTEGER NOT NULL,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### reservations 테이블
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  user_id UUID REFERENCES users(id),
  store_id UUID REFERENCES stores(id),
  customer_name VARCHAR NOT NULL,
  customer_phone VARCHAR NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  requirements TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 로드맵

### Phase 1 - MVP (완료)
- [x] 기본 UI/UX 구현
- [x] 딜 목록 표시
- [x] 검색 및 필터링
- [x] 사용자 인증 시스템
- [x] 예약 시스템

### Phase 2 - 확장 (진행중)
- [ ] 대리점 관리자 페이지
- [ ] 실시간 알림 시스템
- [ ] 고급 검색 필터
- [ ] 리뷰 및 평점 시스템

### Phase 3 - 고도화 (예정)
- [ ] 모바일 앱 (React Native)
- [ ] 결제 시스템 연동
- [ ] AI 기반 추천 시스템
- [ ] 데이터 분석 대시보드

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 관련 문의: [your-email@example.com]

프로젝트 링크: [https://github.com/your-username/phone-deals-app]

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
