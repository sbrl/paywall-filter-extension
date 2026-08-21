(function () {
  const MULTI_PART_TLDS = new Set([
    'co.uk', 'co.jp', 'co.nz', 'co.za', 'com.au', 'com.br', 'co.in',
    'ac.uk', 'org.uk', 'gov.uk',
  ]);

  function registrableDomain(hostname) {
    const parts = hostname.toLowerCase().split('.');
    if (parts.length <= 2) return hostname.toLowerCase();
    const lastTwo = parts.slice(-2).join('.');
    if (MULTI_PART_TLDS.has(lastTwo) && parts.length >= 3) {
      return parts.slice(-3).join('.');
    }
    return lastTwo;
  }

  const PAYWALL_MAP = new Map(PAYWALLED_DOMAINS.map((p) => [p.domain, p.type]));
  const selfDomain = registrableDomain(location.hostname);
  let whitelist = new Set();

  function loadWhitelist() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({ subscribedDomains: [] }, (data) => {
        whitelist = new Set(data.subscribedDomains.map((d) => d.toLowerCase()));
        resolve();
      });
    });
  }

  function badgeFor(type) {
    const span = document.createElement('span');
    span.className = 'pwf-badge pwf-' + type;
    span.textContent = type === 'hard' ? '🔒 paywalled'
      : type === 'metered' ? '🔒 metered'
      : '🔒 soft paywall';
    return span;
  }

  function scan() {
    const links = document.querySelectorAll('a[href]:not([data-pwf-checked])');
    links.forEach((a) => {
      a.setAttribute('data-pwf-checked', '1');
      let url;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol)) return;
      const domain = registrableDomain(url.hostname);
      if (domain === selfDomain) return;
      if (whitelist.has(domain)) return;
      const type = PAYWALL_MAP.get(domain);
      if (!type) return;
      // Avoid stacking a badge on every link inside a result block --
      // one per distinct href is plenty.
      if (a.parentElement && a.parentElement.querySelector(':scope > .pwf-badge')) return;
      a.insertAdjacentElement('afterend', badgeFor(type));
    });
  }

  loadWhitelist().then(() => {
    scan();
    const observer = new MutationObserver(() => scan());
    observer.observe(document.body, { childList: true, subtree: true });
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.subscribedDomains) {
      // Whitelist changed -- re-check everything, including links already
      // marked as processed, since a newly-whitelisted domain's badges
      // need to come back off.
      whitelist = new Set((changes.subscribedDomains.newValue || []).map((d) => d.toLowerCase()));
      document.querySelectorAll('.pwf-badge').forEach((b) => b.remove());
      document.querySelectorAll('[data-pwf-checked]').forEach((a) => a.removeAttribute('data-pwf-checked'));
      scan();
    }
  });
})();
