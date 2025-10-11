export const i18n = {
  lang: localStorage.getItem('lang') || 'tr',
  translations: {},
  isLoaded: false,

  async load(lang) {
    try {
      const response = await fetch(`/src/locales/${lang}.json`);
      this.translations = await response.json();
      this.lang = lang;
      this.isLoaded = true;
      localStorage.setItem('lang', lang);

      window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
    } catch (error) {
      console.error(`Dil dosyası yüklenemedi (${lang}):`, error);
    }
  },

  t(key) {
    return this.translations[key] || key;
  },

  // ← burayı ekliyoruz
  async setLang(lang) {
    await this.load(lang);
  }
};
