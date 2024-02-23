import Gradient from './Gradient.js';

declare global {
  interface Window {
    Gradient: typeof Gradient;
  }
}

if (typeof window !== 'undefined') {
  window.Gradient = Gradient;
}

