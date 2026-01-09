import type { InferEntrySchema } from 'astro:content';
import { DateTime } from 'luxon';

export const SYMBOLS: Record<InferEntrySchema<'articles'>[number]['type'] | InferEntrySchema<'assignments'>['type'] | InferEntrySchema<'slides'>['type'] | InferEntrySchema<'videos'>[number]['type'] | InferEntrySchema<'games'>[number]['type'], string> = {
  'article': '📖',
  'assignment': '📝',
  'slides': '🎞️',
  'video': '📽️',
  'game': '🎮',
};

export const GATEKEEPER_PASSWORD = 'compscirocks';

export const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/** Takes a starting date in ISO format (`YYYY-MM-DD`) and returns a formatted string. */
export const formatWeekString = (isoString: string, { duration }: { duration?: number } = {}) => {
  const start = DateTime.fromISO(isoString, { zone: 'America/Los_Angeles' });
  duration = duration ?? (1000 * 60 * 60 * 24 * 6);
  const end = DateTime.fromMillis(start.toMillis() + duration);
  const startString = start.toFormat('MMM dd');
  const monthDiffers = start.month !== end.month;
  const endString = end.toFormat(monthDiffers ? 'MMM dd' : 'dd');
  return `${startString}–${endString}`;
};

/** Unslugifies a string */
export const unslugify = (str: string) => str.split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');

/** Checks if a string is an external link */
export const isHrefExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * Checks if an assignment is assigned before the current date.
 *
 * @param date - The date of the assignment
 */
export const assignedBeforeNow = (date: Date | string) => {
  const _date = typeof date === 'string' ? DateTime.fromISO(date, { zone: 'America/Los_Angeles' }) : DateTime.fromJSDate(date, { zone: 'America/Los_Angeles' });
  const { milliseconds } = _date.diffNow();
  return milliseconds < 0;
};

/**
 * Computes the relative href for a resource.
 */
export const getResourceHref = (resource: {
  id: string;
  collection: string;
  data: { href?: string };
}, pathname?: string) => {
  // If the resource has a resources property, return the href
  if (resource.data.href) {
    return resource.data.href;
  }

  // Return relative href based on collection and slug
  const slug = resource.id.split('/').at(1)?.split('.').at(0)
  if (slug) {
    return `${pathname ?? ''}/${resource.collection}/${slug}`;
  }
}

/**
 * Computes the anchor target for a link.
 */
export const getAnchorTarget = (href: string | undefined) => {
  // external links opened in new tab
  return href && isHrefExternal(href) ? '_blank' : undefined
}

const RESOURCE_SORT_ORDER = ['slides', 'video', 'article', 'game', 'assignment'] as const;

export const resourceSorter = (a: { data: { type: typeof RESOURCE_SORT_ORDER[number] } }, b: { data: { type: typeof RESOURCE_SORT_ORDER[number] } }) => {
  return RESOURCE_SORT_ORDER.indexOf(a.data.type) - RESOURCE_SORT_ORDER.indexOf(b.data.type);
}