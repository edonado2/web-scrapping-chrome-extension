import { useState } from 'react';
import './App.css';

interface data {
  title: string;
  bodyText: string;
  images: string[];
  headers: string[];
  links: string[];
}

function App() {
  const [scrapedData, setScrapedData] = useState<data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleScrape = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get the current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];

      // Check if we can access this tab
      if (!currentTab?.id || !currentTab.url || currentTab.url.startsWith('chrome://')) {
        setError('Cannot access this page. Please try a different webpage.');
        setIsLoading(false);
        return;
      }

      // Execute the content script
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: scrapePage,
        });

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
          await sendToServer(data as data);
          setSuccess('Data scraped successfully!');
        } else {
          setError('No data scraped or incorrect format.');
        }
      } catch (scriptError) {
        console.error('Script execution error:', scriptError);
        setError('Failed to execute content script. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while scraping the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrapePage = () => {
    return new Promise<data>((resolve) => {
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
  
  const sendToServer = async (data: data) => {
    try {
      const response = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      setScrapedData(result);
    } catch (err) {
      console.error('Server error:', err);
      setError('Failed to send data to server. Make sure the server is running.');
      throw err;
    }
  };

  return (
    <div className="container">
      <h1>Web Scraper</h1>
      <button 
        onClick={handleScrape} 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            Scraping...
          </>
        ) : (
          'Scrape Page'
        )}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {scrapedData && (
        <div className="output">
          <h2>{scrapedData.title || 'No title available'}</h2>
          <p>{scrapedData.bodyText || 'No body text available'}</p>
          
          {scrapedData.images.length > 0 && (
            <div className="images">
              <h3>Images</h3>
              {scrapedData.images.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Scraped image ${index + 1}`} 
                  className="scraped-image" 
                  loading="lazy"
                />
              ))}
            </div>
          )}
          
          {scrapedData.headers.length > 0 && (
            <div className="headers">
              <h3>Headers</h3>
              <ul>
                {scrapedData.headers.map((header, index) => (
                  <li key={index}>{header}</li>
                ))}
              </ul>
            </div>
          )}
          
          {scrapedData.links.length > 0 && (
            <div className="links">
              <h3>Links</h3>
              <ul>
                {scrapedData.links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
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
