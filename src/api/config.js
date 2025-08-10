// API configuration
export const API_URL = import.meta.env.VITE_API_URL;

// Log de débogage pour vérifier la configuration
console.log('🔧 [Config] VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('🔧 [Config] API_URL exporté:', API_URL);
console.log('🔧 [Config] All env vars:', import.meta.env);
