// Load CSS
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

// Load Script
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

// Initialize Form with Select2
async function initForm() {
  const formContainer = document.getElementById('form-container');
  
  try {
    console.log('📝 Loading Select2 resources...');
    
    // Load jQuery first (required for Select2)
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js');
    console.log('✅ jQuery loaded');
    
    // Check if jQuery loaded
    if (typeof jQuery === 'undefined') {
      throw new Error('jQuery library not loaded');
    }
    
    // Load Select2 CSS and JS
    await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css');
    console.log('✅ Select2 CSS loaded');
    
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js');
    console.log('✅ Select2 JS loaded');
    
    // Check if Select2 loaded
    if (typeof jQuery.fn.select2 === 'undefined') {
      throw new Error('Select2 library not loaded');
    }
    
    console.log('✅ All libraries loaded successfully');

    // Build the form HTML
    formContainer.innerHTML = `
      <form class="demo-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
          <label for="country">Select Country:</label>
          <select id="country" class="select2-control" style="width: 100%">
            <option value="">Choose a country...</option>
            <option value="us">United States</option>
            <option value="mx">Mexico</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="es">Spain</option>
            <option value="it">Italy</option>
            <option value="jp">Japan</option>
            <option value="cn">China</option>
          </select>
        </div>

        <div class="form-group">
          <label for="skills">Select Skills (Multiple):</label>
          <select id="skills" class="select2-control" multiple style="width: 100%">
            <option value="js">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <button type="submit" class="submit-btn">Submit Form</button>
      </form>
    `;

    console.log('✅ Form HTML created');

    // Initialize Select2 on all select elements with custom styling
    jQuery('.select2-control').select2({
      theme: 'default',
      width: '100%',
      placeholder: 'Select an option...',
      minimumResultsForSearch: 5
    });

    console.log('✅ Select2 initialized on form controls');

    // Add custom styling to Select2 dropdowns for minimalist theme
    const style = document.createElement('style');
    style.textContent = `
      .select2-container--default .select2-selection--single {
        border: 1px solid #000000 !important;
        border-radius: 0 !important;
        height: 44px !important;
        padding: 10px 12px !important;
      }
      
      .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: 24px !important;
        padding-left: 0 !important;
      }
      
      .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 42px !important;
      }
      
      .select2-container--default .select2-selection--multiple {
        border: 1px solid #000000 !important;
        border-radius: 0 !important;
        min-height: 44px !important;
      }
      
      .select2-container--default.select2-container--focus .select2-selection--single,
      .select2-container--default.select2-container--focus .select2-selection--multiple {
        border-color: #000000 !important;
        background-color: #f5f5f5 !important;
      }
      
      .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background-color: #000000 !important;
        color: white !important;
      }
      
      .select2-container--default .select2-selection--multiple .select2-selection__choice {
        background-color: #000000 !important;
        border: 1px solid #000000 !important;
        border-radius: 0 !important;
        color: white !important;
      }
      
      .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
        color: white !important;
      }
      
      .select2-dropdown {
        border: 1px solid #000000 !important;
        border-radius: 0 !important;
      }
    `;
    document.head.appendChild(style);
    console.log('Custom styles applied');

    // Form submission handler
    jQuery('.demo-form').on('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: jQuery('#name').val(),
        country: jQuery('#country').val(),
        skills: jQuery('#skills').val()
      };
      
      console.log('Form Data:', formData);
      
      let message = 'Form submitted successfully!\n\n';
      message += 'Name: ' + formData.name + '\n';
      message += 'Country: ' + (formData.country || 'Not selected') + '\n';
      message += 'Skills: ' + (formData.skills && formData.skills.length > 0 ? formData.skills.join(', ') : 'None selected');
      
      alert(message);
    });

    console.log('Form initialized and ready');

  } catch (error) {
    console.error('Error loading Select2:', error);
    formContainer.innerHTML = 
      '<div style="text-align: center; padding: 40px; border: 1px solid #e0e0e0;">' +
      '<p style="color: #000000; font-size: 18px; margin-bottom: 10px;">⚠️ Failed to load form</p>' +
      '<p style="color: #666666; font-size: 14px;">Please check your internet connection and refresh the page.</p>' +
      '<p style="color: #999999; font-size: 12px; margin-top: 10px;">' + error.message + '</p>' +
      '</div>';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}