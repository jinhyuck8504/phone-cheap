// ===========================================
// 폰싸게 메인 애플리케이션
// ===========================================

// 전역 변수
var currentUser = null;
var currentUserType = 'adult';
var currentDeals = [];
var selectedDeal = null;

// 딜 목록 로드
function loadDeals() {
    var dealsGrid = document.getElementById('dealsGrid');
    if (dealsGrid) {
        dealsGrid.innerHTML = '<div class="loading">딜을 불러오는 중...</div>';
    }
    
    try {
        // 검색 필터 가져오기
        var location = document.getElementById('location') ? document.getElementById('location').value : '';
        var carrier = document.getElementById('carrier') ? document.getElementById('carrier').value : '';
        
        // 샘플 데이터 가져오기
        var deals = getDealsData();
        
        // 필터 적용
        deals = filterDealsByLocation(deals, location);
        deals = filterDealsByCarrier(deals, carrier);
        deals = filterDealsByUserType(deals, currentUserType);
        
        // 전역 변수에 저장
        currentDeals = deals;
        
        // 화면에 렌더링
        renderDeals(deals);
        
    } catch (error) {
        console.error('딜 로드 오류:', error);
        if (dealsGrid) {
            dealsGrid.innerHTML = '<div class="error">딜을 불러오는 중 오류가 발생했습니다.</div>';
        }
    }
}

// 사용자 타입 변경
function setActiveUserType(type, clickedButton) {
    // 모든 버튼에서 active 클래스 제거
    var allBtns = document.querySelectorAll('.user-type-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove('active');
    }
    
    // 클릭된 버튼에 active 클래스 추가
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // 현재 사용자 타입 업데이트
    currentUserType = type;
    console.log('사용자 타입 변경됨:', currentUserType);
    
    // 딜 목록 새로고침
    loadDeals();
}

// 로그아웃
function logout() {
    // Supabase 로그아웃 시도
    supabaseLogout().then(function() {
        console.log('로그아웃 완료');
    }).catch(function(error) {
        console.log('로그아웃 오류:', error);
    });
    
    // UI 업데이트
    updateUIForGuest();
    showNotification('로그아웃되었습니다.', 'success');
    renderDeals(currentDeals);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    try {
        // 사용자 타입 버튼 - 개별적으로 이벤트 추가
        var adultBtn = document.querySelector('[data-type="adult"]');
        var seniorBtn = document.querySelector('[data-type="senior"]');
        var minorBtn = document.querySelector('[data-type="minor"]');
        
        if (adultBtn) {
            adultBtn.addEventListener('click', function() {
                console.log('일반 성인 버튼 클릭됨');
                setActiveUserType('adult', this);
            });
        }
        
        if (seniorBtn) {
            seniorBtn.addEventListener('click', function() {
                console.log('시니어 버튼 클릭됨');
                setActiveUserType('senior', this);
            });
        }
        
        if (minorBtn) {
            minorBtn.addEventListener('click', function() {
                console.log('미성년자 버튼 클릭됨');
                setActiveUserType('minor', this);
            });
        }

        // 검색 폼
        var searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                loadDeals();
            });
        }

        // 로그인 폼
        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }

        // 회원가입 폼
        var signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup();
            });
        }

        // 예약 폼
        var reservationForm = document.getElementById('reservationForm');
        if (reservationForm) {
            reservationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleReservation();
            });
        }

        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // 날짜 제한 설정
        setupDateRestrictions();
        
    } catch (error) {
        console.error('이벤트 리스너 설정 오류:', error);
    }
}

// 로그인 처리
function handleLogin() {
    var email = document.getElementById('loginEmail');
    var password = document.getElementById('loginPassword');
    
    if (!email || !password) {
        showNotification('폼 요소를 찾을 수 없습니다.', 'error');
        return;
    }
    
    var emailValue = email.value.trim();
    var passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        showNotification('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    if (!validateEmail(emailValue)) {
        showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }

    // Supabase 로그인 시도
    if (supabaseClient) {
        supabaseLogin(emailValue, passwordValue)
            .then(function(user) {
                currentUser = {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || emailValue.split('@')[0],
                    phone: user.user_metadata?.phone || '010-1234-5678'
                };
                
                updateUIForUser(currentUser);
                closeModal('loginModal');
                showNotification('로그인되었습니다!', 'success');
                renderDeals(currentDeals);
                
                // 폼 초기화
                email.value = '';
                password.value = '';
            })
            .catch(function(error) {
                console.log('Supabase 로그인 오류:', error);
                showNotification('로그인 오류: ' + error.message, 'error');
            });
    } else {
        // 데모 로그인 (Supabase 없을 때)
        currentUser = {
            id: 'demo-user',
            email: emailValue,
            name: emailValue.split('@')[0],
            phone: '010-1234-5678'
        };
        
        updateUIForUser(currentUser);
        closeModal('loginModal');
        showNotification('로그인되었습니다! (데모 모드)', 'success');
        renderDeals(currentDeals);
        
        // 폼 초기화
        email.value = '';
        password.value = '';
    }
}

// 회원가입 처리
function handleSignup() {
    var email = document.getElementById('signupEmail');
    var password = document.getElementById('signupPassword');
    var name = document.getElementById('signupName');
    var phone = document.getElementById('signupPhone');
    
    if (!email || !password || !name || !phone) {
        showNotification('폼 요소를 찾을 수 없습니다.', 'error');
        return;
    }
    
    var emailValue = email.value.trim();
    var passwordValue = password.value.trim();
    var nameValue = name.value.trim();
    var phoneValue = phone.value.trim();

    if (!emailValue || !passwordValue || !nameValue || !phoneValue) {
        showNotification('모든 필수 정보를 입력해주세요.', 'error');
        return;
    }
    
    if (!validateEmail(emailValue)) {
        showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    if (!validatePhone(phoneValue)) {
        showNotification('올바른 휴대폰 번호를 입력해주세요.', 'error');
        return;
    }

    // Supabase 회원가입 시도
    if (supabaseClient) {
        supabaseSignUp(emailValue, passwordValue, nameValue, phoneValue, currentUserType)
            .then(function(user) {
                closeModal('signupModal');
                showNotification('회원가입이 완료되었습니다! 이메일을 확인해주세요.', 'success');
                
                // 폼 초기화
                email.value = '';
                password.value = '';
                name.value = '';
                phone.value = '';
            })
            .catch(function(error) {
                console.log('Supabase 회원가입 오류:', error);
                showNotification('회원가입 오류: ' + error.message, 'error');
            });
    } else {
        // 데모 회원가입 (Supabase 없을 때)
        closeModal('signupModal');
        showNotification('회원가입이 완료되었습니다! (데모 모드)', 'success');
        
        // 폼 초기화
        email.value = '';
        password.value = '';
        name.value = '';
        phone.value = '';
    }
}

// 예약 처리
function handleReservation() {
    if (!selectedDeal || !currentUser) {
        showNotification('예약 정보가 올바르지 않습니다.', 'error');
        return;
    }
    
    var customerName = document.getElementById('customerName');
    var customerPhone = document.getElementById('customerPhone');
    var visitDate = document.getElementById('visitDate');
    var visitTime = document.getElementById('visitTime');
    var requirements = document.getElementById('requirements');
    
    if (!customerName || !customerPhone || !visitDate || !visitTime) {
        showNotification('폼 요소를 찾을 수 없습니다.', 'error');
        return;
    }
    
    var customerNameValue = customerName.value.trim();
    var customerPhoneValue = customerPhone.value.trim();
    var visitDateValue = visitDate.value;
    var visitTimeValue = visitTime.value;
    var requirementsValue = requirements ? requirements.value.trim() : '';

    if (!customerNameValue || !customerPhoneValue || !visitDateValue || !visitTimeValue) {
        showNotification('모든 예약 정보를 입력해주세요.', 'error');
        return;
    }
    
    if (!validatePhone(customerPhoneValue)) {
        showNotification('올바른 휴대폰 번호를 입력해주세요.', 'error');
        return;
    }

    var reservationData = {
        deal_id: selectedDeal.id,
        user_id: currentUser.id,
        store_id: selectedDeal.store_id || 'sample-store',
        customer_name: customerNameValue,
        customer_phone: customerPhoneValue,
        visit_date: visitDateValue,
        visit_time: visitTimeValue,
        requirements: requirementsValue,
        status: 'pending'
    };

    // Supabase 예약 저장 시도
    if (supabaseClient) {
        saveReservation(reservationData)
            .then(function(result) {
                closeModal('reservationModal');
                showNotification('예약이 성공적으로 접수되었습니다!', 'success');
                
                // 폼 초기화
                customerName.value = '';
                customerPhone.value = '';
                visitDate.value = '';
                visitTime.value = '';
                if (requirements) requirements.value = '';
                selectedDeal = null;
            })
            .catch(function(error) {
                console.log('Supabase 예약 저장 오류:', error);
                showNotification('예약 오류: ' + error.message, 'error');
            });
    } else {
        // 데모 예약 (Supabase 없을 때)
        closeModal('reservationModal');
        showNotification('예약이 성공적으로 접수되었습니다! (데모 모드)', 'success');
        
        // 폼 초기화
        customerName.value = '';
        customerPhone.value = '';
        visitDate.value = '';
        visitTime.value = '';
        if (requirements) requirements.value = '';
        selectedDeal = null;
    }
}

// 앱 초기화
function initApp() {
    console.log('폰싸게 앱 시작!');
    
    try {
        // Supabase 초기화 시도
        var supabaseReady = initSupabase();
        
        if (supabaseReady) {
            console.log('✅ Supabase 모드로 실행');
        } else {
            console.log('⚠️ 데모 모드로 실행');
        }
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        // 초기 딜 로드
        loadDeals();
        
        console.log('폰싸게 앱 초기화 완료!');
        
    } catch (error) {
        console.error('앱 초기화 오류:', error);
        var dealsGrid = document.getElementById('dealsGrid');
        if (dealsGrid) {
            dealsGrid.innerHTML = '<div class="error">앱 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.</div>';
        }
    }
}

// DOM 로드 후 앱 시작
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});
