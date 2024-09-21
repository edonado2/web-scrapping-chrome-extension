import { useState } from 'react';
import './App.css';

function App() {
  const [scrapedData, setScrapedData] = useState<{
    title: string;
    bodyText: string;
    images: string[];
    headers: string[];
    links: string[];
  } | null>(null);

  const handleScrape = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id! },
          func: scrapePage,
        },
        async (results) => {
          const data = results[0]?.result;

          if (
            data &&
            typeof data === 'object' &&
            'title' in data &&
            'bodyText' in data &&
            'images' in data &&
            'headers' in data &&
            'links' in data
          ) {
            sendToServer(data as {
              title: string;
              bodyText: string;
              images: string[];
              headers: string[];
              links: string[];
            });
          } else {
            console.error('No data scraped or incorrect format.');
          }
        }
      );
    });
  };

  const scrapePage = () => {
    return new Promise<{
      title: string;
      bodyText: string;
      images: string[];
      headers: string[];
      links: string[];
    }>((resolve) => {
      const observer = new MutationObserver(() => {
        const title = document.title || '';
        const bodyText = document.body.innerText || '';
        const images = Array.from(document.images).map((img) => img.src);
        const headers = Array.from(document.querySelectorAll('h1, h2, h3')).map((header) =>
          (header as HTMLElement).innerText
        );
        const links = Array.from(document.querySelectorAll('a')).map((link) =>
          (link as HTMLAnchorElement).href
        );

        if (bodyText.length > 0 || images.length > 0 || headers.length > 0 || links.length > 0) {
          observer.disconnect();
          resolve({ title, bodyText, images, headers, links });
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Fallback for static pages or instantly loaded content
      const title = document.title || '';
      const bodyText = document.body.innerText || '';
      const images = Array.from(document.images).map((img) => img.src);
      const headers = Array.from(document.querySelectorAll('h1, h2, h3')).map((header) =>
        (header as HTMLElement).innerText
      );
      const links = Array.from(document.querySelectorAll('a')).map((link) =>
        (link as HTMLAnchorElement).href
      );

      if (bodyText.length > 0 || images.length > 0 || headers.length > 0 || links.length > 0) {
        observer.disconnect();
        resolve({ title, bodyText, images, headers, links });
      }
    });
  };
  
  const sendToServer = async (data: {
    title: string;
    bodyText: string;
    images: string[];
    headers: string[];
    links: string[];
  }) => {
    const response = await fetch('http://localhost:5000/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setScrapedData(result);
  };

  return (
    <div className="container">
      <h1>Web Scraper</h1>
      <button onClick={handleScrape}>Scrape Page</button>
      {scrapedData && (
        <div className="output">
          <h2>{scrapedData.title || 'No title available'}</h2>
          <p>{scrapedData.bodyText || 'No body text available'}</p>
          {scrapedData.images.length > 0 && (
            <div className="images">
              <h3>Images:</h3>
              {scrapedData.images.map((img, index) => (
                <img key={index} src={img} alt={`scraped ${index}`} className="scraped-image" />
              ))}
            </div>
          )}
          {scrapedData.headers.length > 0 && (
            <div className="headers">
              <h3>Headers:</h3>
              <ul>
                {scrapedData.headers.map((header, index) => (
                  <li key={index}>{header}</li>
                ))}
              </ul>
            </div>
          )}
          {scrapedData.links.length > 0 && (
            <div className="links">
              <h3>Links:</h3>
              <ul>
                {scrapedData.links.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
