if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/callSelect/sw.js')
    .then(() => console.log('[SW] Registered successfully'))
    .catch(err => console.error('[SW] Registration failed:', err));
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA install prompt available');
});

window.addEventListener('load', () => {
  if (deferredPrompt) {
    setTimeout(() => {
      const install = confirm('Install this app on your device?');
      if (install && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log(' User accepted PWA install');
          }
          deferredPrompt = null;
        });
      }
    }, 3000);
  }
});

window.addEventListener('online', () => {
  console.log(' Back online');
});

window.addEventListener('offline', () => {
  console.log('You are offline');
});