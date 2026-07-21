import './main.css'

/* ------------------------------------------------------------------
   Preloader — favicon mark + counting percentage on a black screen.
   Counts up while the page loads, then fades out and unlocks scroll
   as soon as the window `load` event fires.
------------------------------------------------------------------ */
const preloader = document.getElementById('preloader')
if (preloader) {
  const pctEl = preloader.querySelector('[data-preloader-pct]')
  let loaded = document.readyState === 'complete'
  window.addEventListener('load', () => {
    loaded = true
  })

  const setPct = (n) => {
    if (pctEl) pctEl.textContent = n + '%'
  }

  const finish = () => {
    setPct(100)
    preloader.classList.add('preloader--hidden')
    document.body.classList.remove('preloading')
    preloader.addEventListener('transitionend', () => preloader.remove(), {
      once: true,
    })
  }

  let pct = 0
  const tick = () => {
    if (loaded) {
      finish()
      return
    }
    // Ease toward 99 while we wait, then snap to 100 the moment we're done.
    pct = Math.min(99, pct + Math.max(1, Math.round((99 - pct) * 0.08)))
    setPct(pct)
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/* ------------------------------------------------------------------
   Header scroll state + scroll-reveal animations
------------------------------------------------------------------ */
const header = document.getElementById('site-header')
if (header) {
  window.addEventListener(
    'scroll',
    () => header.classList.toggle('scrolled', window.scrollY > 40),
    { passive: true }
  )
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in')
        io.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 }
)
document.querySelectorAll('[data-aos]').forEach((el) => {
  const delay = el.getAttribute('data-aos-delay')
  if (delay) el.style.transitionDelay = delay + 'ms'
  io.observe(el)
})

/* ------------------------------------------------------------------
   FAQ accordion
------------------------------------------------------------------ */
window.toggleFaq = function (row) {
  const isOpen = row.classList.contains('open')
  document.querySelectorAll('.faq-row').forEach((r) => {
    r.classList.remove('open')
    const a = r.querySelector('.faq-a')
    const icon = r.querySelector('.faq-icon')
    if (a) a.style.display = 'none'
    if (icon) icon.innerHTML = '+'
  })
  if (!isOpen) {
    row.classList.add('open')
    const a = row.querySelector('.faq-a')
    const icon = row.querySelector('.faq-icon')
    if (a) a.style.display = ''
    if (icon) icon.innerHTML = '&minus;'
  }
}

/* ------------------------------------------------------------------
   Mobile menu
------------------------------------------------------------------ */
window.toggleMenu = function () {
  document.body.classList.toggle('menu-open')
}
document.addEventListener('click', (e) => {
  if (
    document.body.classList.contains('menu-open') &&
    e.target.closest('#site-nav a')
  ) {
    document.body.classList.remove('menu-open')
  }
})

/* ------------------------------------------------------------------
   Forms → Web3Forms (https://web3forms.com)

   Any <form data-mailform> is submitted with fetch() to Web3Forms, a
   serverless form-to-email API that works on any static host (Cloudflare
   Pages, GitHub Pages, etc.) — no PHP or backend required.

   The access key below is a *public* key tied to the Web3Forms account;
   it's safe to ship in client-side code. The delivery address (where
   enquiries land) is configured in the Web3Forms dashboard for this key,
   NOT here. To change the recipient, log in at web3forms.com.

   Web3Forms replies with JSON { success: boolean, message: string } and
   honours the hidden `botcheck` honeypot already present in each form.
   A [data-form-status] element inside the form shows the result. During
   `npm run dev` submissions send for real (the API is reachable in dev).
------------------------------------------------------------------ */
const WEB3FORMS_ACCESS_KEY = 'a15984ae-29fd-45e7-8ecd-a39efc69fb43'
function setStatus(el, message, ok) {
  if (!el) return
  el.textContent = message
  el.style.display = message ? 'block' : 'none'
  el.style.color = ok ? 'rgba(255,255,255,0.9)' : '#ff9db1'
}

document.querySelectorAll('form[data-mailform]').forEach((form) => {
  const statusEl = form.querySelector('[data-form-status]')
  const submitBtn = form.querySelector('[type="submit"]')
  const defaultLabel = submitBtn ? submitBtn.textContent : ''

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Honeypot: if the hidden field is filled, it's a bot — pretend success.
    const honeypot = form.querySelector('input[name="botcheck"]')
    if (honeypot && honeypot.checked) {
      setStatus(statusEl, 'Thanks — your message has been sent.', true)
      form.reset()
      return
    }

    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Sending…'
    }
    setStatus(statusEl, '', true)

    try {
      const formData = new FormData(form)
      formData.append('access_key', WEB3FORMS_ACCESS_KEY)
      // Give each enquiry a clear subject line in the inbox.
      const formType = formData.get('form_type')
      formData.append(
        'subject',
        formType === 'newsletter'
          ? 'Newsletter signup — Black Seven'
          : 'Website enquiry — Black Seven'
      )
      formData.append('from_name', 'Black Seven Website')

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      let data = {}
      try {
        data = await res.json()
      } catch {
        throw new Error('Unexpected response from the server.')
      }

      if (res.ok && data.success) {
        setStatus(
          statusEl,
          formType === 'newsletter'
            ? 'Thanks — you have been added to the list.'
            : 'Thanks — your message has been sent.',
          true
        )
        form.reset()
      } else {
        setStatus(
          statusEl,
          data.message || 'Something went wrong. Please try again.',
          false
        )
      }
    } catch (err) {
      setStatus(
        statusEl,
        'Could not send right now. Please email richard@blackseven.co directly.',
        false
      )
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = defaultLabel
      }
    }
  })
})
