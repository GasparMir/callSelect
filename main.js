// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log(' Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌Service Worker registration failed:', error);
      });
  });
}

// Install PWA prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('💡 PWA install prompt available');
});

// Show install notification
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

// Online/Offline status
window.addEventListener('online', () => {
  console.log('🟢 Back online');
});

window.addEventListener('offline', () => {
  console.log('🔴 You are offline');
});