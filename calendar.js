// Load FullCalendar CSS
const loadCSS = (href) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {
      console.log('✅ CSS loaded:', href);
      resolve();
    };
    link.onerror = (error) => {
      console.error('❌ CSS failed to load:', href, error);
      reject(new Error(`Failed to load CSS: ${href}`));
    };
    document.head.appendChild(link);
  });
};

// Load FullCalendar JS
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log('✅ Script loaded:', src);
      resolve();
    };
    script.onerror = (error) => {
      console.error('❌ Script failed to load:', src, error);
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.body.appendChild(script);
  });
};

// Initialize Calendar
async function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  
  try {
    // Load FullCalendar resources from CDN
    console.log('📅 Loading FullCalendar resources...');
    
    // Load FullCalendar JS (includes CSS embedded)
    await loadScript('https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js');
    
    console.log('✅ FullCalendar loaded successfully');

    // Check if FullCalendar is available
    if (typeof FullCalendar === 'undefined') {
      throw new Error('FullCalendar library not loaded');
    }

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [
        {
          title: 'Team Meeting',
          start: new Date().toISOString().split('T')[0] + 'T10:00:00',
          end: new Date().toISOString().split('T')[0] + 'T11:00:00',
          color: '#000000'
        },
        {
          title: 'Project Deadline',
          start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          color: '#333333'
        },
        {
          title: 'Conference',
          start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          color: '#666666'
        }
      ],
      eventClick: function(info) {
        alert('Event: ' + info.event.title);
      },
      height: 'auto'
    });

    calendar.render();
    console.log('✅ Calendar rendered');

  } catch (error) {
    console.error('❌ Error loading FullCalendar:', error);
    calendarEl.innerHTML = 
      '<div style="text-align: center; padding: 40px; border: 1px solid #e0e0e0;">' +
      '<p style="color: #000000; font-size: 18px; margin-bottom: 10px;">⚠️ Failed to load calendar</p>' +
      '<p style="color: #666666; font-size: 14px;">Please check your internet connection and refresh the page.</p>' +
      '<p style="color: #999999; font-size: 12px; margin-top: 10px;">' + error.message + '</p>' +
      '</div>';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendar);
} else {
  initCalendar();
}