// ===========================================
// 딜 데이터 관리
// 나중에 대리점에서 직접 등록할 예정
// ===========================================

// 샘플 딜 데이터
var sampleDeals = [
    // 갤럭시 시리즈
    {
        id: 'sample-1',
        phone_model: '갤럭시 S23',
        carrier: 'SKT',
        discounted_price: 299000,
        original_price: 999000,
        features: ['프리미엄', '카메라', '방문설치'],
        store_name: '스마트폰마트 강남점',
        address: '서울시 강남구 테헤란로 123',
        verified: true
    },
    {
        id: 'sample-2',
        phone_model: '갤럭시 S24',
        carrier: 'KT',
        discounted_price: 399000,
        original_price: 1199000,
        features: ['최신기종', 'AI 카메라', '무료설치'],
        store_name: '갤럭시 전문점 서초',
        address: '서울시 서초구 강남대로 456',
        verified: true
    },
    {
        id: 'sample-3',
        phone_model: '갤럭시 S24+',
        carrier: 'LGU+',
        discounted_price: 499000,
        original_price: 1399000,
        features: ['대화면', '프리미엄', '당일개통'],
        store_name: '모바일킹 역삼점',
        address: '서울시 강남구 역삼로 789',
        verified: true
    },
    {
        id: 'sample-4',
        phone_model: '갤럭시 A54',
        carrier: 'SKT',
        discounted_price: 199000,
        original_price: 599000,
        features: ['큰 화면', '간편 UI', '24개월 무상 AS'],
        store_name: '신뢰폰샵 서초점',
        address: '서울시 서초구 강남대로 321',
        verified: true
    },
    {
        id: 'sample-5',
        phone_model: '갤럭시 Z플립5',
        carrier: 'KT',
        discounted_price: 799000,
        original_price: 1499000,
        features: ['폴더블', '컴팩트', '프리미엄'],
        store_name: '하이테크 강남본점',
        address: '서울시 강남구 논현로 654',
        verified: true
    },
    
    // 아이폰 시리즈
    {
        id: 'sample-6',
        phone_model: '아이폰 15',
        carrier: 'SKT',
        discounted_price: 599000,
        original_price: 1299000,
        features: ['최신기종', '프리미엄', '무료설치'],
        store_name: '애플 인증 대리점',
        address: '서울시 강남구 역삼로 456',
        verified: true
    },
    {
        id: 'sample-7',
        phone_model: '아이폰 15 Pro',
        carrier: 'KT',
        discounted_price: 899000,
        original_price: 1599000,
        features: ['Pro 모델', '티타늄', '48MP 카메라'],
        store_name: '아이폰 전문점 강남',
        address: '서울시 강남구 선릉로 123',
        verified: true
    },
    {
        id: 'sample-8',
        phone_model: '아이폰 14',
        carrier: 'LGU+',
        discounted_price: 499000,
        original_price: 1199000,
        features: ['인기모델', '안정성', '방문설치'],
        store_name: '스마트폰 플러스',
        address: '서울시 서초구 서초대로 789',
        verified: true
    },
    {
        id: 'sample-9',
        phone_model: '아이폰 SE',
        carrier: 'SKT',
        discounted_price: 299000,
        original_price: 699000,
        features: ['컴팩트', '경제적', '홈버튼'],
        store_name: '모바일 아울렛',
        address: '서울시 강동구 천호대로 456',
        verified: true
    },
    
    // 기타 브랜드
    {
        id: 'sample-10',
        phone_model: '샤오미 14',
        carrier: 'KT',
        discounted_price: 349000,
        original_price: 799000,
        features: ['고성능', '가성비', 'Leica 카메라'],
        store_name: '글로벌폰 강남점',
        address: '서울시 강남구 테헤란로 234',
        verified: true
    },
    {
        id: 'sample-11',
        phone_model: '구글 픽셀 8',
        carrier: 'LGU+',
        discounted_price: 399000,
        original_price: 899000,
        features: ['순정 안드로이드', 'AI 기능', '카메라'],
        store_name: '테크노폰 서초',
        address: '서울시 서초구 방배로 567',
        verified: true
    },
    
    // 시니어 맞춤 모델
    {
        id: 'sample-12',
        phone_model: '갤럭시 A34 (시니어)',
        carrier: 'SKT',
        discounted_price: 159000,
        original_price: 499000,
        features: ['큰 글씨', '간편 모드', '긴급 버튼'],
        store_name: '실버폰 전문점',
        address: '서울시 송파구 올림픽로 123',
        verified: true
    },
    {
        id: 'sample-13',
        phone_model: '아이폰 13 mini',
        carrier: 'KT',
        discounted_price: 399000,
        original_price: 899000,
        features: ['작은 크기', '가벼움', '한손 조작'],
        store_name: '컴팩트폰 강남',
        address: '서울시 강남구 도산대로 345',
        verified: true
    },
    
    // 미성년자 맞춤 모델
    {
        id: 'sample-14',
        phone_model: '갤럭시 A14',
        carrier: 'LGU+',
        discounted_price: 129000,
        original_price: 399000,
        features: ['학생할인', '부모관리', '내구성'],
        store_name: '학생폰 전문점',
        address: '서울시 관악구 남부순환로 678',
        verified: true
    },
    {
        id: 'sample-15',
        phone_model: '아이폰 12',
        carrier: 'SKT',
        discounted_price: 349000,
        original_price: 999000,
        features: ['학생추천', '안전기능', '제한모드'],
        store_name: '주니어모바일',
        address: '서울시 노원구 상계로 234',
        verified: true
    },
    
    // 추가 다양한 모델
    {
        id: 'sample-16',
        phone_model: '갤럭시 S23 FE',
        carrier: 'KT',
        discounted_price: 249000,
        original_price: 799000,
        features: ['팬 에디션', '가성비', '카메라'],
        store_name: '모바일월드 강남',
        address: '서울시 강남구 강남대로 567',
        verified: true
    },
    {
        id: 'sample-17',
        phone_model: '아이폰 13 Pro',
        carrier: 'LGU+',
        discounted_price: 699000,
        original_price: 1399000,
        features: ['ProRAW', '120Hz', '시네마틱'],
        store_name: '프로폰 서초점',
        address: '서울시 서초구 서초중앙로 890',
        verified: true
    },
    {
        id: 'sample-18',
        phone_model: '갤럭시 Z폴드5',
        carrier: 'SKT',
        discounted_price: 1299000,
        original_price: 2399000,
        features: ['폴더블', '대화면', '멀티태스킹'],
        store_name: '플래그십 강남',
        address: '서울시 강남구 압구정로 123',
        verified: true
    }
];

// 데이터 필터링 함수들
function getDealsData() {
    return sampleDeals;
}

function filterDealsByLocation(deals, location) {
    if (!location) return deals;
    return deals.filter(function(deal) {
        return deal.address.includes(location);
    });
}

function filterDealsByCarrier(deals, carrier) {
    if (!carrier) return deals;
    return deals.filter(function(deal) {
        return deal.carrier === carrier;
    });
}

function filterDealsByUserType(deals, userType) {
    // 사용자 타입별 필터링 로직
    if (userType === 'senior') {
        // 시니어용 모델을 우선적으로 표시
        return deals.sort(function(a, b) {
            var aIsSenior = a.phone_model.includes('시니어') || a.features.includes('큰 글씨') || a.features.includes('간편 모드');
            var bIsSenior = b.phone_model.includes('시니어') || b.features.includes('큰 글씨') || b.features.includes('간편 모드');
            
            if (aIsSenior && !bIsSenior) return -1;
            if (!aIsSenior && bIsSenior) return 1;
            return 0;
        });
    } else if (userType === 'minor') {
        // 미성년자용 모델을 우선적으로 표시
        return deals.sort(function(a, b) {
            var aIsMinor = a.features.includes('학생할인') || a.features.includes('부모관리') || a.features.includes('안전기능');
            var bIsMinor = b.features.includes('학생할인') || b.features.includes('부모관리') || b.features.includes('안전기능');
            
            if (aIsMinor && !bIsMinor) return -1;
            if (!aIsMinor && bIsMinor) return 1;
            return 0;
        });
    }
    
    // 일반 성인은 모든 딜 표시 (가격순 정렬)
    return deals.sort(function(a, b) {
        return a.discounted_price - b.discounted_price;
    });
}
