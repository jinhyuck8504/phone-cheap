// ===========================================
// 공통 유틸리티 함수들
// ===========================================

// 알림 표시
function showNotification(message, type) {
    var notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification ' + (type || 'success') + ' show';
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
}

// 모달 열기
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// 모달 닫기
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 로그인 모달 열기
function openLoginModal() {
    openModal('loginModal');
}

// 회원가입 모달 열기
function openSignupModal() {
    openModal('signupModal');
}

// 예약 모달 열기
function openReservationModal(dealId) {
    if (!currentUser) {
        showNotification('로그인 후 예약이 가능합니다.', 'error');
        return;
    }

    // 선택된 딜 찾기
    for (var i = 0; i < currentDeals.length; i++) {
        if (currentDeals[i].id === dealId) {
            selectedDeal = currentDeals[i];
            break;
        }
    }
    
    if (!selectedDeal) {
        showNotification('딜 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    // 모달 제목 설정
    var modalTitle = document.querySelector('#reservationModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = selectedDeal.phone_model + ' 예약 신청';
    }
    
    // 사용자 정보 자동 입력
    var customerName = document.getElementById('customerName');
    var customerPhone = document.getElementById('customerPhone');
    
    if (customerName && currentUser.name) {
        customerName.value = currentUser.name;
    }
    if (customerPhone && currentUser.phone) {
        customerPhone.value = currentUser.phone;
    }
    
    openModal('reservationModal');
}

// UI 업데이트 - 로그인 상태
function updateUIForUser(user) {
    var authButtons = document.getElementById('authButtons');
    var userInfo = document.getElementById('userInfo');
    var userName = document.getElementById('userName');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userInfo) userInfo.classList.add('show');
    if (userName) userName.textContent = user.name;
}

// UI 업데이트 - 로그아웃 상태
function updateUIForGuest() {
    var authButtons = document.getElementById('authButtons');
    var userInfo = document.getElementById('userInfo');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userInfo) userInfo.classList.remove('show');
    
    // 전역 변수 초기화
    currentUser = null;
}

// 딜 렌더링
function renderDeals(deals) {
    var dealsGrid = document.getElementById('dealsGrid');
    if (!dealsGrid) return;
    
    if (!deals || deals.length === 0) {
        dealsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">조건에 맞는 딜이 없습니다.</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < deals.length; i++) {
        var deal = deals[i];
        
        // 특징 태그 생성
        var featuresHtml = '';
        if (deal.features && deal.features.length > 0) {
            for (var j = 0; j < deal.features.length; j++) {
                featuresHtml += '<span class="feature-tag">' + escapeHtml(deal.features[j]) + '</span>';
            }
        }
        
        // 예약 버튼 HTML
        var buttonHtml = currentUser 
            ? '<button class="reserve-btn" onclick="openReservationModal(\'' + deal.id + '\')">예약하기</button>'
            : '<button class="reserve-btn" disabled title="로그인 후 예약 가능합니다">로그인 후 예약</button>';

        // 딜 카드 HTML 생성
        html += '<div class="deal-card">' +
            '<div class="deal-header">' +
                '<div class="deal-phone">' + escapeHtml(deal.phone_model) + '</div>' +
                (deal.verified ? '<div class="deal-badge">인증</div>' : '') +
            '</div>' +
            '<div class="deal-info">' +
                '<div class="deal-price">' + formatPrice(deal.discounted_price) + '원</div>' +
                '<div class="deal-original">' + formatPrice(deal.original_price) + '원</div>' +
            '</div>' +
            '<div class="deal-store">🏪 ' + escapeHtml(deal.store_name) + '</div>' +
            '<div class="deal-distance">📍 ' + escapeHtml(deal.address) + '</div>' +
            '<div class="deal-features">' + featuresHtml + '</div>' +
            buttonHtml +
        '</div>';
    }
    
    dealsGrid.innerHTML = html;
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 가격 포맷팅
function formatPrice(price) {
    if (!price || isNaN(price)) return '0';
    return parseInt(price).toLocaleString();
}

// 폼 검증
function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    var phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// 날짜 설정 (오늘 이후만 선택 가능)
function setupDateRestrictions() {
    var visitDate = document.getElementById('visitDate');
    if (visitDate) {
        var today = new Date().toISOString().split('T')[0];
        visitDate.min = today;
    }
}

// 디버그 함수
function debugApp() {
    console.log('=== 폰싸게 앱 디버그 정보 ===');
    console.log('현재 사용자:', currentUser);
    console.log('현재 딜 수:', currentDeals ? currentDeals.length : 0);
    console.log('현재 사용자 타입:', currentUserType);
    console.log('선택된 딜:', selectedDeal);
    console.log('Supabase 클라이언트:', !!supabaseClient);
}

// 전역에서 접근 가능하도록 설정
window.debugApp = debugApp;
