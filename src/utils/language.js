export const getCurrentLanguage = () => {
  if (typeof window === 'undefined') {
    return 'fr';
  }
  return window.localStorage.getItem('app_language') || 'fr';
};

export const withLanguageQuery = (url, lang) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}lang=${lang}`;
};
