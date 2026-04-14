import { GlobalRegistrator } from '@happy-dom/global-registrator';
GlobalRegistrator.register();

import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './src/App';

// Mocking window.requestAnimationFrame which Leaflet needs
(global as any).requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0);

try {
  const html = renderToString(<App />);
  console.log("Rendered HTML length:", html.length);
  console.log("Preview (first 1000 chars):", html.substring(0, 1000));
} catch (error) {
  console.error("Render failed:", error);
}
