import { useEffect } from 'react';

const SITE_NAME = 'ISOMÉTRICA';
const DEFAULT_DESCRIPTION =
  'Plataforma de estudos para engenharia com trilhas, aulas, prática e acompanhamento de progresso.';
const DEFAULT_IMAGE = '/landing-hero-engineering-study.jpg';

type SeoProps = {
  title?: string;
  description?: string;
  image?: string | null;
  type?: 'website' | 'article';
  noIndex?: boolean;
};

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${window.location.origin}${normalizedPath}`;
}

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = url;
}

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
}: SeoProps) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const currentUrl = window.location.href;
    const imageUrl = absoluteUrl(image ?? DEFAULT_IMAGE);

    document.documentElement.lang = 'pt-BR';
    document.title = pageTitle;
    setCanonical(currentUrl);

    setMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });
    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex,nofollow' : 'index,follow',
    });
    setMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });
    setMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: pageTitle,
    });
    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    setMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    });
    setMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: currentUrl,
    });
    setMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: imageUrl,
    });
    setMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    setMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: pageTitle,
    });
    setMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: imageUrl,
    });
  }, [description, image, noIndex, title, type]);

  return null;
}
