let count = 1;

chrome.alarms.create({ periodInMinutes: 0.1 });

chrome.alarms.onAlarm.addListener(() => {
  console.log(`polling ${count}`);
  count += 1;
});

chrome.runtime.onMessage.addListener(() => {
  chrome.tabs.query({ active: true }).then((tab) => {
    chrome.runtime.sendMessage({
      data: tab,
    });
    chrome.runtime.reload();
    chrome.tabs.reload()
  });
});
