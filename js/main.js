/**
 * VETROARTS ACCESSORIES LTD - SHARED JAVASCRIPT
 * Brand: Vetroarts (Kampala, Uganda)
 * Features: Mobile Nav, Accessible Validation, Mailto Preparation, Integration Annotations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initCustomOrderForm();
  initBusinessOrderForm();
  initContactForm();
  initDynamicYear();
});

/**
 * 1. Mobile Navigation & Accessibility
 */
function initNavigation() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu(isOpen) {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      navMenu.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  // Close when clicking nav links
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-active')) {
        toggleMenu(false);
      }
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('is-active') &&
      !navMenu.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
}

/**
 * 2. Sticky Header Elevation on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/**
 * 3. Validation Helpers
 */
function clearErrors(form) {
  form.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('has-error');
  });
  form.querySelectorAll('.form-control').forEach(input => {
    input.removeAttribute('aria-invalid');
  });
}

function setFieldError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;

  group.classList.add('has-error');
  input.setAttribute('aria-invalid', 'true');

  let errorElem = group.querySelector('.field-error');
  if (errorElem) {
    errorElem.textContent = message;
  }
}

function validateEmailOrPhone(val) {
  if (!val || val.trim().length === 0) return false;
  const trimmed = val.trim();
  // Basic check for email (@ and .) or phone (at least 7 digits)
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isPhone = /^[+\d\s\-()]{7,20}$/.test(trimmed);
  return isEmail || isPhone;
}

/**
 * Helper to display the prepared enquiry feedback card and launch mailto
 */
function handlePreparedEnquiry({
  feedbackCard,
  summaryElem,
  compiledSummary,
  mailtoUrl,
  recipientEmail
}) {
  if (summaryElem) {
    summaryElem.textContent = compiledSummary;
  }

  if (feedbackCard) {
    feedbackCard.classList.add('is-visible');
    feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Set up copy button inside feedback card if present
  const copyBtn = feedbackCard?.querySelector('.btn-copy-summary');
  const copyMsg = feedbackCard?.querySelector('.copy-feedback-msg');

  if (copyBtn && !copyBtn.dataset.bound) {
    copyBtn.dataset.bound = 'true';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summaryElem.textContent);
        if (copyMsg) {
          copyMsg.classList.add('show');
          setTimeout(() => copyMsg.classList.remove('show'), 3000);
        }
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = summaryElem.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        if (copyMsg) {
          copyMsg.classList.add('show');
          setTimeout(() => copyMsg.classList.remove('show'), 3000);
        }
      }
    });
  }

  // Trigger mailto client
  window.location.href = mailtoUrl;
}

/**
 * 4. Custom Orders Form Handler
 * Fields: Name, Email or Phone, Phone Model, Design Request, Quantity
 */
function initCustomOrderForm() {
  const form = document.getElementById('custom-order-form');
  if (!form) return;

  const feedbackCard = document.getElementById('custom-order-feedback');
  const summaryElem = document.getElementById('custom-order-summary');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const nameInput = document.getElementById('custom-name');
    const contactInput = document.getElementById('custom-contact');
    const modelInput = document.getElementById('custom-model');
    const requestInput = document.getElementById('custom-request');
    const qtyInput = document.getElementById('custom-qty');

    let isValid = true;
    let firstInvalid = null;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'Please provide your full name.');
      isValid = false;
      firstInvalid = firstInvalid || nameInput;
    }

    if (!validateEmailOrPhone(contactInput.value)) {
      setFieldError(contactInput, 'Please enter a valid email address or phone number.');
      isValid = false;
      firstInvalid = firstInvalid || contactInput;
    }

    if (!modelInput.value.trim()) {
      setFieldError(modelInput, 'Please specify your exact phone model (e.g. iPhone 15 Pro, Samsung S24).');
      isValid = false;
      firstInvalid = firstInvalid || modelInput;
    }

    if (!requestInput.value.trim()) {
      setFieldError(requestInput, 'Please describe your custom design requirements (artwork, photo, name/initials, or logo).');
      isValid = false;
      firstInvalid = firstInvalid || requestInput;
    }

    const qtyVal = parseInt(qtyInput.value, 10);
    if (isNaN(qtyVal) || qtyVal < 1) {
      setFieldError(qtyInput, 'Please specify a quantity of 1 or more.');
      isValid = false;
      firstInvalid = firstInvalid || qtyInput;
    }

    if (!isValid) {
      firstInvalid.focus();
      return;
    }

    /* 
     * BACKEND INTEGRATION POINT:
     * To send this enquiry to a server endpoint (e.g., via Formspree, a REST API, or Cloud Functions),
     * you can replace this mailto block with:
     * 
     * fetch('https://your-api-endpoint.com/api/custom-enquiry', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     name: nameInput.value.trim(),
     *     contact: contactInput.value.trim(),
     *     model: modelInput.value.trim(),
     *     designRequest: requestInput.value.trim(),
     *     quantity: qtyVal
     *   })
     * }).then(res => res.json()).then(...)
     */

    const recipient = 'r.ajuk@seedofwheels.org';
    const subject = `Vetroarts Custom Case Enquiry: ${nameInput.value.trim()} (${modelInput.value.trim()})`;
    const bodyText = [
      `VETROARTS ACCESSORIES - CUSTOM CASE ENQUIRY`,
      `--------------------------------------------------`,
      `Full Name: ${nameInput.value.trim()}`,
      `Email / Phone: ${contactInput.value.trim()}`,
      `Phone Model: ${modelInput.value.trim()}`,
      `Quantity: ${qtyVal}`,
      ``,
      `Design Request Details:`,
      `${requestInput.value.trim()}`,
      `--------------------------------------------------`,
      `Enquiry generated via Vetroarts website.`
    ].join('\n');

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    handlePreparedEnquiry({
      feedbackCard,
      summaryElem,
      compiledSummary: bodyText,
      mailtoUrl,
      recipientEmail: recipient
    });
  });
}

/**
 * 5. Business Orders Form Handler
 * Fields: Organisation, Contact Person, Phone or Email, Estimated Quantity, Branding Requirements, Preferred Delivery Location
 */
function initBusinessOrderForm() {
  const form = document.getElementById('business-order-form');
  if (!form) return;

  const feedbackCard = document.getElementById('business-order-feedback');
  const summaryElem = document.getElementById('business-order-summary');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const orgInput = document.getElementById('biz-org');
    const personInput = document.getElementById('biz-person');
    const contactInput = document.getElementById('biz-contact');
    const qtyInput = document.getElementById('biz-quantity');
    const brandingInput = document.getElementById('biz-branding');
    const locationInput = document.getElementById('biz-location');

    let isValid = true;
    let firstInvalid = null;

    if (!orgInput.value.trim()) {
      setFieldError(orgInput, 'Please enter your organisation or company name.');
      isValid = false;
      firstInvalid = firstInvalid || orgInput;
    }

    if (!personInput.value.trim()) {
      setFieldError(personInput, 'Please provide the contact person name.');
      isValid = false;
      firstInvalid = firstInvalid || personInput;
    }

    if (!validateEmailOrPhone(contactInput.value)) {
      setFieldError(contactInput, 'Please provide a valid business phone number or email.');
      isValid = false;
      firstInvalid = firstInvalid || contactInput;
    }

    if (!qtyInput.value.trim()) {
      setFieldError(qtyInput, 'Please state your estimated quantity (e.g. 50, 100, 500 units).');
      isValid = false;
      firstInvalid = firstInvalid || qtyInput;
    }

    if (!brandingInput.value.trim()) {
      setFieldError(brandingInput, 'Please describe your branding requirements (e.g. corporate logo, Pantone colours, staff names).');
      isValid = false;
      firstInvalid = firstInvalid || brandingInput;
    }

    if (!locationInput.value.trim()) {
      setFieldError(locationInput, 'Please specify your preferred delivery location (e.g. Kampala, Entebbe, Jinja, or regional East Africa destination).');
      isValid = false;
      firstInvalid = firstInvalid || locationInput;
    }

    if (!isValid) {
      firstInvalid.focus();
      return;
    }

    /* 
     * BACKEND INTEGRATION POINT:
     * Point this to your server or webhook for business bulk enquiries.
     */

    const recipient = 'r.ajuk@seedofwheels.org';
    const subject = `Vetroarts Business Order Enquiry: ${orgInput.value.trim()} (${qtyInput.value.trim()} units)`;
    const bodyText = [
      `VETROARTS ACCESSORIES - BUSINESS & BULK ORDER ENQUIRY`,
      `--------------------------------------------------`,
      `Organisation / Company: ${orgInput.value.trim()}`,
      `Contact Person: ${personInput.value.trim()}`,
      `Phone / Email: ${contactInput.value.trim()}`,
      `Estimated Quantity: ${qtyInput.value.trim()}`,
      `Preferred Delivery Location: ${locationInput.value.trim()}`,
      ``,
      `Branding & Case Requirements:`,
      `${brandingInput.value.trim()}`,
      `--------------------------------------------------`,
      `Note: Manufacturing capability is currently in development in Kampala, Uganda.`
    ].join('\n');

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    handlePreparedEnquiry({
      feedbackCard,
      summaryElem,
      compiledSummary: bodyText,
      mailtoUrl,
      recipientEmail: recipient
    });
  });
}

/**
 * 6. General Contact Form Handler
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const feedbackCard = document.getElementById('contact-feedback');
  const summaryElem = document.getElementById('contact-summary');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const nameInput = document.getElementById('contact-name');
    const contactInput = document.getElementById('contact-email-phone');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;
    let firstInvalid = null;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'Please provide your name.');
      isValid = false;
      firstInvalid = firstInvalid || nameInput;
    }

    if (!validateEmailOrPhone(contactInput.value)) {
      setFieldError(contactInput, 'Please enter a valid email address or phone number.');
      isValid = false;
      firstInvalid = firstInvalid || contactInput;
    }

    if (!messageInput.value.trim()) {
      setFieldError(messageInput, 'Please write your message or enquiry.');
      isValid = false;
      firstInvalid = firstInvalid || messageInput;
    }

    if (!isValid) {
      firstInvalid.focus();
      return;
    }

    const subjectVal = subjectInput.value.trim() || 'General Enquiry';
    const recipient = 'r.ajuk@seedofwheels.org';
    const mailSubject = `Vetroarts Contact Enquiry: ${subjectVal} - ${nameInput.value.trim()}`;
    const bodyText = [
      `VETROARTS ACCESSORIES - GENERAL ENQUIRY`,
      `--------------------------------------------------`,
      `Sender: ${nameInput.value.trim()}`,
      `Contact Info: ${contactInput.value.trim()}`,
      `Subject: ${subjectVal}`,
      ``,
      `Message:`,
      `${messageInput.value.trim()}`,
      `--------------------------------------------------`
    ].join('\n');

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(bodyText)}`;

    handlePreparedEnquiry({
      feedbackCard,
      summaryElem,
      compiledSummary: bodyText,
      mailtoUrl,
      recipientEmail: recipient
    });
  });
}

/**
 * 7. Dynamic Footer Copyright Year
 */
function initDynamicYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
