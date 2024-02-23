import Gradient from './Gradient.js';
declare global {
    interface Window {
        Gradient: typeof Gradient;
    }
}
