import { useEffect } from 'react';
import { type PageMeta, pageMetaUrl } from '../content/page-meta';

function getMetaByName(name: string): HTMLMetaElement {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  return el as HTMLMetaElement;
}

function getMetaByProperty(property: string): HTMLMetaElement {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  return el as HTMLMetaElement;
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const previous = {
      title: document.title,
      description: getMetaByName('description').content,
      ogTitle: getMetaByProperty('og:title').content,
      ogDescription: getMetaByProperty('og:description').content,
      ogUrl: getMetaByProperty('og:url').content,
      ogImage: getMetaByProperty('og:image').content,
    };

    document.title = meta.title;
    getMetaByName('description').content = meta.description;
    getMetaByProperty('og:title').content = meta.ogTitle;
    getMetaByProperty('og:description').content = meta.ogDescription;
    getMetaByProperty('og:url').content = pageMetaUrl(meta);
    getMetaByProperty('og:image').content = meta.ogImage ?? previous.ogImage;

    return () => {
      document.title = previous.title;
      getMetaByName('description').content = previous.description;
      getMetaByProperty('og:title').content = previous.ogTitle;
      getMetaByProperty('og:description').content = previous.ogDescription;
      getMetaByProperty('og:url').content = previous.ogUrl;
      getMetaByProperty('og:image').content = previous.ogImage;
    };
  }, [meta]);
}
