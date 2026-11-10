// Service worker do app Casa — só cuida das notificações.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { texto: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Casa', {
    body: d.texto || '',
    icon: 'casa-icon-192.png',
    badge: 'casa-icon-192.png',
    tag: d.tag || 'casa',
    renotify: true,
    data: { url: 'casa.html' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if (c.url.includes('casa.html') && 'focus' in c) return c.focus(); }
    return clients.openWindow('casa.html');
  }));
});
