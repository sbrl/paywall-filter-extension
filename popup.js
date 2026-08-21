function registrableDomain(hostname) {
  const parts = hostname.toLowerCase().split('.');
  return parts.length <= 2 ? hostname.toLowerCase() : parts.slice(-2).join('.');
}

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

chrome.storage.sync.get({ subscribedDomains: [] }, (data) => {
  const n = data.subscribedDomains.length;
  document.getElementById('count').textContent =
    n === 0 ? 'No subscribed sites added yet.' : `${n} site${n === 1 ? '' : 's'} whitelisted.`;
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) return;
  let domain;
  try {
    domain = registrableDomain(new URL(tab.url).hostname);
  } catch {
    return;
  }
  chrome.storage.sync.get({ subscribedDomains: [] }, (data) => {
    if (data.subscribedDomains.includes(domain)) return;
    const btn = document.getElementById('addCurrent');
    btn.textContent = `I subscribe to ${domain}`;
    btn.style.display = 'block';
    btn.addEventListener('click', () => {
      const next = [...data.subscribedDomains, domain].sort();
      chrome.storage.sync.set({ subscribedDomains: next }, () => {
        document.getElementById('status').textContent = `Added ${domain}.`;
        btn.style.display = 'none';
      });
    });
  });
});
