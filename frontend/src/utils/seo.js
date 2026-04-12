/**
 * SEO Utility Functions
 * Centralizes slug generation, meta description building,
 * and JSON-LD structured data for property pages.
 */

const SITE_NAME = 'SR Property Advisor';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://srpropertyadvisor.in';
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://srpropertyadvisor.in';

/** Convert text to URL-safe slug */
export const slugify = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/** Build a canonical URL for a property */
export const propertyCanonical = (slugOrId) =>
  `${SITE_URL}/property/slug/${slugOrId}`;

/** Generate a dynamic page title */
export const buildTitle = (project) => {
  if (!project) return `Premium Properties in India | ${SITE_NAME}`;
  const loc = project.location?.name || 'India';
  return `${project.type} in ${loc} | ${project.title} | ${SITE_NAME}`;
};

/** Generate a rich meta description */
export const buildDescription = (project) => {
  if (!project) return `Explore premium verified properties across India. Buy or invest with SR Property Advisor – trusted real estate experts.`;
  const loc = project.location?.name || 'India';
  const type = project.type || 'Property';
  const status = project.status === 'Available' ? 'Available for sale' : project.status;
  const price = project.price ? ` at ${project.price}` : '';
  return `${status} – ${type} in ${loc}${price}. ${project.description ? project.description.slice(0, 100) + '…' : 'Legally verified. Contact SR Property Advisor for details.'}`;
};

/** Generate meta keywords string */
export const buildKeywords = (project) => {
  if (!project) return 'property in india, real estate advisor, buy property';
  const loc = project.location?.name || 'India';
  const type = project.type || 'property';
  return [
    `${type} in ${loc}`,
    `buy ${type} ${loc}`,
    `${type.toLowerCase()} for sale ${loc}`,
    project.title,
    `real estate ${loc}`,
    `SR Property Advisor`,
    `property investment India`,
  ].join(', ');
};

/** Build JSON-LD RealEstateListing structured data */
export const buildPropertySchema = (project) => {
  if (!project) return null;
  const loc = project.location?.name || 'India';
  const imgUrl = project.coverImage
    ? `${BASE_URL}/api${project.coverImage}`
    : `${SITE_URL}/images/hero_bg_exterior_1773059538662.png`;

  const availability =
    project.status === 'Available'
      ? 'https://schema.org/InStock'
      : project.status === 'Sold Out'
      ? 'https://schema.org/SoldOut'
      : 'https://schema.org/PreOrder';

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.title,
    description: project.description || `${project.type} in ${loc}`,
    image: imgUrl,
    url: project.slug ? propertyCanonical(project.slug) : `${SITE_URL}/property/${project._id}`,
    datePosted: project.createdAt,
    availability,
    offers: project.price
      ? {
          '@type': 'Offer',
          price: project.price,
          priceCurrency: 'INR',
          availability,
        }
      : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: loc,
      addressCountry: 'IN',
    },
    brand: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
};

/** Build JSON-LD BreadcrumbList structured data */
export const buildBreadcrumbSchema = (project) => {
  const loc = project?.location?.name || 'India';
  const items = [
    { name: 'Home', url: SITE_URL },
    { name: 'Properties', url: `${SITE_URL}/projects` },
    { name: loc, url: `${SITE_URL}/projects?location=${encodeURIComponent(loc)}` },
    { name: project?.title || 'Property', url: project?.slug ? propertyCanonical(project.slug) : `${SITE_URL}/property/${project?._id}` },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export { SITE_NAME, SITE_URL };
