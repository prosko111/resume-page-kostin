// Service Worker для Портфолио Алексея Костина
// Версия 1.0.0

const CACHE_NAME = 'alexey-kostin-portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Ресурсы для кэширования
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/manifest.json',
    // Внешние ресурсы
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Удаляем старые кэши
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    // Обрабатываем только GET запросы
    if (event.request.method !== 'GET') {
        return;
    }

    // Стратегия Cache First для статических ресурсов
    if (isStaticAsset(event.request.url)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request)
                        .then(fetchResponse => {
                            return caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    cache.put(event.request, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
                })
                .catch(() => {
                    // Fallback для HTML страниц
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                })
        );
    } 
    // Стратегия Network First для динамического контента
    else {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Кэшируем успешные ответы
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Возвращаем из кэша если сеть недоступна
                    return caches.match(event.request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            // Fallback для HTML страниц
                            if (event.request.destination === 'document') {
                                return caches.match('/index.html');
                            }
                        });
                })
        );
    }
});

// Проверка, является ли ресурс статическим
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    const staticDomains = ['fonts.googleapis.com', 'cdnjs.cloudflare.com'];
    
    return staticExtensions.some(ext => url.includes(ext)) || 
           staticDomains.some(domain => url.includes(domain)) ||
           STATIC_ASSETS.includes(url);
}

// Обработка фоновой синхронизации
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'contact-form') {
        event.waitUntil(
            // Здесь можно добавить логику для отправки формы обратной связи
            handleContactFormSync()
        );
    }
});

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', event => {
    console.log('Service Worker: Push received');
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/icon-192x192.png',
            badge: '/assets/images/icon-72x72.png',
            vibrate: [200, 100, 200],
            tag: 'portfolio-notification',
            actions: [
                {
                    action: 'view',
                    title: 'Посмотреть',
                    icon: '/assets/images/icon-view.png'
                },
                {
                    action: 'close',
                    title: 'Закрыть',
                    icon: '/assets/images/icon-close.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Функция для обработки синхронизации формы обратной связи
async function handleContactFormSync() {
    try {
        // Получаем сохраненные данные формы из IndexedDB
        const formData = await getStoredFormData();
        
        if (formData) {
            // Отправляем данные на сервер
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Удаляем данные из локального хранилища после успешной отправки
                await clearStoredFormData();
                console.log('Contact form synchronized successfully');
            }
        }
    } catch (error) {
        console.error('Contact form sync failed:', error);
    }
}

// Вспомогательные функции для работы с IndexedDB
async function getStoredFormData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PortfolioData', 1);
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['contactForms'], 'readonly');
            const store = transaction.objectStore('contactForms');
            const getRequest = store.get('pending');
            
            getRequest.onsuccess = function() {
                resolve(getRequest.result);
            };
            
            getRequest.onerror = function() {
                reject(getRequest.error);
            };
        };
        
        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function clearStoredFormData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PortfolioData', 1);
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['contactForms'], 'readwrite');
            const store = transaction.objectStore('contactForms');
            const deleteRequest = store.delete('pending');
            
            deleteRequest.onsuccess = function() {
                resolve();
            };
            
            deleteRequest.onerror = function() {
                reject(deleteRequest.error);
            };
        };
        
        request.onerror = function() {
            reject(request.error);
        };
    });
}

// Обработка ошибок
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Логирование событий жизненного цикла
console.log('Service Worker: Script loaded');