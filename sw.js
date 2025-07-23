// 폰싸게 PWA Service Worker
const CACHE_NAME = 'phonecheap-v1.0.0';
const OFFLINE_URL = '/offline.html';

// 캐시할 파일들
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/manifest.json',
  // 오프라인 페이지
  '/offline.html'
];

// Service Worker 설치
self.addEventListener('install', event => {
  console.log('🔧 폰싸게 SW 설치 중...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 파일 캐싱 중...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ 폰싸게 SW 설치 완료!');
        // 즉시 활성화
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ SW 설치 실패:', error);
      })
  );
});

// Service Worker 활성화
self.addEventListener('activate', event => {
  console.log('🚀 폰싸게 SW 활성화 중...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 오래된 캐시 삭제
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ 폰싸게 SW 활성화 완료!');
      // 모든 클라이언트 제어
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시 반환
        if (response) {
          console.log('📦 캐시에서 로드:', event.request.url);
          return response;
        }

        // 네트워크에서 가져오기
        return fetch(event.request)
          .then(response => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답 복사
            const responseToCache = response.clone();

            // 캐시에 저장
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('🌐 네트워크 오류, 오프라인 페이지 표시');
            
            // HTML 페이지 요청이고 네트워크가 안 될 때
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // 기본 오프라인 응답
            return new Response('오프라인 상태입니다.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            });
          });
      })
  );
});

// 푸시 알림 처리
self.addEventListener('push', event => {
  console.log('🔔 푸시 알림 수신:', event);
  
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다!',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%233b82f6"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="white"%3E📱%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%233b82f6"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="white"%3E📱%3C/text%3E%3C/svg%3E',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: '확인하기'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('폰싸게', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
  console.log('🔔 알림 클릭:', event);
  
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', event => {
  console.log('🔄 백그라운드 동기화:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 오프라인 상태에서 쌓인 데이터 동기화
      syncOfflineData()
    );
  }
});

// 오프라인 데이터 동기화 함수
async function syncOfflineData() {
  try {
    // LocalStorage에서 동기화할 데이터 확인
    const clients = await self.clients.matchAll();
    
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_DATA',
        message: '오프라인 데이터를 동기화합니다.'
      });
    });
    
    console.log('✅ 백그라운드 동기화 완료');
  } catch (error) {
    console.error('❌ 동기화 실패:', error);
  }
}

// 앱 업데이트 확인
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🚀 폰싸게 Service Worker 로드 완료!');
