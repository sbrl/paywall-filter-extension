const list = document.getElementById('list');
const form = document.getElementById('addForm');
const input = document.getElementById('domainInput');

function normalize(raw) {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  return d;
}

function render(domains) {
  list.innerHTML = '';
  if (!domains.length) {
    list.innerHTML = '<li class="empty">No subscriptions added yet.</li>';
    return;
  }
  domains.forEach((d) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = d;
    const btn = document.createElement('button');
    btn.textContent = 'Remove';
    btn.addEventListener('click', () => removeDomain(d));
    li.append(span, btn);
    list.appendChild(li);
  });
}

function load() {
  chrome.storage.sync.get({ subscribedDomains: [] }, (data) => render(data.subscribedDomains));
}

function addDomain(domain) {
  chrome.storage.sync.get({ subscribedDomains: [] }, (data) => {
    if (!domain || data.subscribedDomains.includes(domain)) return;
    const next = [...data.subscribedDomains, domain].sort();
    chrome.storage.sync.set({ subscribedDomains: next }, load);
  });
}

function removeDomain(domain) {
  chrome.storage.sync.get({ subscribedDomains: [] }, (data) => {
    const next = data.subscribedDomains.filter((d) => d !== domain);
    chrome.storage.sync.set({ subscribedDomains: next }, load);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addDomain(normalize(input.value));
  input.value = '';
});

load();
