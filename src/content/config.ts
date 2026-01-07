import { z, defineCollection } from 'astro:content';
import { DateTime } from 'luxon';

const zone = 'America/Los_Angeles';

const dateSchema = z.union([z.string(), z.date()]).transform(date => {
  let _date: DateTime;
  if (typeof date === 'string') {
    _date = DateTime.fromISO(date, { zone });
  } else {
    _date = DateTime.fromJSDate(date, { zone });
  }
  return _date.toJSDate();
});

/** Slug is the unique identifier for the class. */
const classSchema = z.object({
  /** Name of the class. */
  name: z.string(),
  /** Description of the class. */
  description: z.string(),
  /** First day of the first semester of the class. */
  startDate: dateSchema,
  /** Last day of the last semester of the class. */
  endDate: dateSchema,
});

const baseResourceSchema = z.object({
  /** Title of the resource (used in h1) */
  title: z.string(),
  /** Description of the resource */
  description: z.string().optional(),
  /** Class that the resource is associated with (this must match the class slug) */
  class: z.string(),
  /** URL of the resource */
  href: z.string().optional(),
  /** Date that the resource should be available to students. */
  date: dateSchema,
  /** Time estimate in minutes; used to estimate student effort */
  time: z.number(),
  /** List of topics this assignment is associated with */
  topics: z.array(z.string()).default([]),
});

export type BaseResource = z.infer<typeof baseResourceSchema>;

const assignmentSchema = baseResourceSchema.extend({
  /** Date the assignment is due */
  due: dateSchema,
  /** Name of the assignment (used in h1) */
  name: z.string(),
  type: z.literal('assignment').default('assignment'),
});

const articleSchema = baseResourceSchema.extend({
  type: z.literal('article').default('article'),
});

const gameSchema = baseResourceSchema.extend({
  type: z.literal('game').default('game'),
});

const slideSchema = baseResourceSchema.extend({
  type: z.literal('slides').default('slides'),
});

const videoSchema = baseResourceSchema.extend({
  type: z.literal('video').default('video'),
});

export const collections = {
  'articles': defineCollection({
    type: 'data',
    schema: z.array(articleSchema),
  }),
  'assignments': defineCollection({
    type: 'content',
    schema: assignmentSchema,
  }),
  'classes': defineCollection({
    type: 'data',
    schema: classSchema,
  }),
  'games': defineCollection({
    type: 'data',
    schema: z.array(gameSchema),
  }),
  'slides': defineCollection({
    type: 'content',
    schema: slideSchema,
  }),
  'videos': defineCollection({
    type: 'data',
    schema: z.array(videoSchema),
  }),
};
