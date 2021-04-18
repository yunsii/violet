export const MOUNT_ELEMENT_ID = 'violet-app';

export function isChromeExtensionEnv() {
  return !!chrome?.runtime?.getURL;
}

export function checkEntry() {
  if (!isChromeExtensionEnv()) {
    return;
  }
  const violetAppHost = document.createElement('div');
  violetAppHost.id = 'violet';
  document.body.appendChild(violetAppHost);

  const violetApp = document.createElement('div');
  violetApp.id = MOUNT_ELEMENT_ID;
  violetAppHost.appendChild(violetApp);
}

export function injectCss() {
  if (!isChromeExtensionEnv()) {
    return;
  }
  const url = chrome.runtime.getURL('style.css');

  console.log('violet css url', url);

  fetch(url, { method: 'GET' })
    .then((response) => response.text())
    .then((css) => {
      console.log('violet css content', css);
      const styleEl = document.createElement('style');
      styleEl.setAttribute('id', 'violet-css');
      styleEl.innerHTML = css;
      document.head.appendChild(styleEl);
    });
}

export function autoReload() {
  const socket = new WebSocket(`ws://localhost:8721`);

  socket.addEventListener('close', () => console.log('socket close'));
  socket.addEventListener('message', (event) => {
    console.log({ message: event.data });
    console.log('will reload violet');
    chrome.runtime.sendMessage({ action: 'reload violet' });
  });
  socket.addEventListener('error', (event) => console.error('error!', event));
}

export function listenServiceWorker() {
  chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
  });
}
