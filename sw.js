// Service Worker untuk Tracker Murajaah Al-Qur'an
// Menangani push notification dan show notification dari pesan halaman

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', (e) => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(d.title || 'Murajaah', {
      body: d.body || '',
      icon: d.icon || '',
      badge: d.badge || '',
      tag: d.tag || 'notif',
      renotify: true,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

// Show notification langsung dari pesan postMessage halaman utama
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SHOW_NOTIF') {
    const d = e.data.payload;
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: d.icon,
      badge: d.badge,
      tag: d.tag || 'notif',
      renotify: true,
      vibrate: [200, 100, 200],
    });
  }
});
