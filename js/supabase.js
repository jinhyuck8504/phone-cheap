// ===========================================
// Supabase 데이터베이스 연동
// ===========================================

// TODO: 본인의 Supabase 프로젝트 정보로 변경하세요
var SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';           // 예: 'https://abcdefgh.supabase.co'
var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // 예: 'eyJhbGciOiJIUzI1NiIsInR...'

// Supabase 클라이언트
var supabaseClient = null;

// Supabase 초기화
function initSupabase() {
    try {
        // Supabase 키가 설정되었는지 확인
        if (SUPABASE_URL.includes('YOUR_') || SUPABASE_ANON_KEY.includes('YOUR_')) {
            console.log('⚠️ Supabase 키가 설정되지 않았습니다. 데모 모드로 실행합니다.');
            return false;
        }
        
        // Supabase 라이브러리 확인
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase 연결 성공!');
            
            // 인증 상태 변화 리스너
            supabaseClient.auth.onAuthStateChange(function(event, session) {
                console.log('Auth state changed:', event);
                
                if (event === 'SIGNED_IN' && session && session.user) {
                    currentUser = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                        phone: session.user.user_metadata?.phone || '010-0000-0000'
                    };
                    updateUIForUser(currentUser);
                    renderDeals(currentDeals);
                } else if (event === 'SIGNED_OUT') {
                    currentUser = null;
                    updateUIForGuest();
                    renderDeals(currentDeals);
                }
            });
            
            return true;
        } else {
            console.log('⚠️ Supabase 라이브러리 로드 실패. 데모 모드로 실행합니다.');
            return false;
        }
    } catch (error) {
        console.log('⚠️ Supabase 초기화 오류:', error, '. 데모 모드로 실행합니다.');
        return false;
    }
}

// Supabase 로그인
function supabaseLogin(email, password) {
    return new Promise(function(resolve, reject) {
        if (!supabaseClient) {
            reject(new Error('Supabase가 초기화되지 않았습니다'));
            return;
        }
        
        supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        }).then(function(result) {
            if (result.data.user) {
                resolve(result.data.user);
            } else {
                reject(new Error('로그인에 실패했습니다'));
            }
        }).catch(function(error) {
            reject(error);
        });
    });
}

// Supabase 회원가입
function supabaseSignUp(email, password, name, phone, userType) {
    return new Promise(function(resolve, reject) {
        if (!supabaseClient) {
            reject(new Error('Supabase가 초기화되지 않았습니다'));
            return;
        }
        
        supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    phone: phone,
                    user_type: userType
                }
            }
        }).then(function(result) {
            if (result.data.user) {
                resolve(result.data.user);
            } else {
                reject(new Error('회원가입에 실패했습니다'));
            }
        }).catch(function(error) {
            reject(error);
        });
    });
}

// Supabase 로그아웃
function supabaseLogout() {
    return new Promise(function(resolve, reject) {
        if (!supabaseClient) {
            resolve(); // Supabase 없어도 로그아웃은 성공으로 처리
            return;
        }
        
        supabaseClient.auth.signOut().then(function() {
            resolve();
        }).catch(function(error) {
            console.log('Supabase 로그아웃 오류:', error);
            resolve(); // 로그아웃은 항상 성공으로 처리
        });
    });
}

// 예약 저장 (나중에 구현)
function saveReservation(reservationData) {
    return new Promise(function(resolve, reject) {
        if (!supabaseClient) {
            reject(new Error('Supabase가 초기화되지 않았습니다'));
            return;
        }
        
        supabaseClient
            .from('reservations')
            .insert([reservationData])
            .select()
            .then(function(result) {
                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result.data);
                }
            });
    });
}

// 딜 데이터 로드 (나중에 구현)
function loadDealsFromDB() {
    return new Promise(function(resolve, reject) {
        if (!supabaseClient) {
            reject(new Error('Supabase가 초기화되지 않았습니다'));
            return;
        }
        
        supabaseClient
            .from('deals')
            .select(`
                *,
                stores!inner(
                    store_name,
                    address,
                    phone,
                    verified
                )
            `)
            .eq('is_active', true)
            .eq('stores.status', 'active')
            .order('created_at', { ascending: false })
            .limit(50)
            .then(function(result) {
                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result.data || []);
                }
            });
    });
}
