import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE_URL = 'https://isometrica-frontend-production.up.railway.app';
const DEFAULT_API_URL = 'https://isometrica-backend-production.up.railway.app';

const siteUrl = normalizeUrl(process.env.VITE_SITE_URL ?? DEFAULT_SITE_URL);
const apiUrl = normalizeUrl(process.env.VITE_API_URL ?? DEFAULT_API_URL);
const distDir = path.resolve('dist');

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/courses', priority: '0.9', changefreq: 'daily' },
  { path: '/register', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
];

function normalizeUrl(value) {
  const trimmed = value.trim().replace(/\/+$/, '');

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function getCourseRoutes() {
  try {
    const response = await fetch(`${apiUrl}/courses`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const courses = Array.isArray(data.courses) ? data.courses : [];

    return courses
      .filter((course) => typeof course.slug === 'string' && course.slug.length > 0)
      .map((course) => ({
        path: `/courses/${course.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
      }));
  } catch {
    return [];
  }
}

function renderSitemap(routes) {
  const urls = routes.map((route) => {
    const loc = `${siteUrl}${route.path}`;

    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

async function main() {
  await mkdir(distDir, { recursive: true });

  const courseRoutes = await getCourseRoutes();
  const routes = [...staticRoutes, ...courseRoutes];

  await writeFile(path.join(distDir, 'sitemap.xml'), renderSitemap(routes));
  await writeFile(
    path.join(distDir, 'robots.txt'),
    [
      'User-agent: *',
      'Allow: /',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n'),
  );

  console.log(`SEO: sitemap gerado com ${routes.length} URLs.`);
}

main();
