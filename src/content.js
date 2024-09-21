chrome.runtime.onMessage.addListener((request, __, sendResponse) => {
    if (request.message === "scrape") {
      const title = document.title;
      const text = document.body.innerText;
      sendResponse({ title, text });
    }
  });
  