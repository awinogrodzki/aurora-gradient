import Gradient from './Gradient';

declare global {
  interface Window {
    Gradient: typeof Gradient;
  }
}

if (typeof window !== 'undefined') {
  window.Gradient = Gradient;
}

