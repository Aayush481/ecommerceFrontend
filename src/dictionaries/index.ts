const dictionaries = {
  it: () => import('./it.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'it' | 'en') => {
  if (locale !== 'it' && locale !== 'en') {
    return dictionaries['it'](); // Default to Italian
  }
  return dictionaries[locale]();
};
