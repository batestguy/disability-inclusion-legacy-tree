import { defineArrayMember, defineField, defineType } from "sanity";

const bilingualString = defineType({
  name: "bilingualString",
  title: "English / Hausa",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ha",
      title: "Hausa",
      type: "string",
      description:
        "Leave blank until translated; never insert unreviewed machine translation.",
    }),
  ],
});

const bilingualText = defineType({
  name: "bilingualText",
  title: "English / Hausa text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({ name: "ha", title: "Hausa", type: "text", rows: 4 }),
  ],
});

const reviewFields = [
  defineField({
    name: "reviewed",
    title: "Editorially reviewed for public use",
    type: "boolean",
    initialValue: false,
    description:
      "The public build includes only published documents with this flag. Check claims, dates, roles, and source links before enabling.",
  }),
  defineField({
    name: "haReviewed",
    title: "Hausa reviewed by a fluent human editor",
    type: "boolean",
    initialValue: false,
    description:
      "Hausa text must be complete and checked before this flag is enabled. Otherwise the website uses English.",
  }),
];

const sourcesField = defineField({
  name: "sources",
  title: "Evidence sources",
  type: "array",
  of: [defineArrayMember({ type: "reference", to: [{ type: "source" }] })],
  validation: (r) => r.required().min(1).unique(),
});

const source = defineType({
  name: "source",
  title: "Evidence source",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Original source URL",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "publisher",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      title: "Source independence",
      type: "string",
      options: {
        list: [
          { title: "Independent reporting or research", value: "independent" },
          {
            title: "Government / institutional official record",
            value: "official",
          },
          { title: "Office / subject announcement", value: "office" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Publication date",
      type: "date",
      description: "Leave blank if the source is undated. Do not infer a date.",
    }),
    defineField({
      name: "accessed",
      title: "Last checked",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "notes",
      title: "Verification notes (editorial only)",
      type: "text",
    }),
    defineField({
      name: "reviewed",
      title: "Source checked and approved",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "title", subtitle: "publisher" } },
});

const achievement = defineType({
  name: "achievement",
  title: "Achievement / initiative",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "bilingualString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Event date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "branch",
      title: "Pillar",
      type: "string",
      options: {
        list: [
          { title: "Policy advocacy", value: "policy" },
          { title: "Economic empowerment", value: "economic" },
          { title: "Digital inclusion", value: "digital" },
          { title: "Assistive technology", value: "assistive" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Evidence status",
      type: "string",
      options: {
        list: [
          { title: "Advocacy / proposal", value: "advocacy" },
          { title: "Announced commitment", value: "announced" },
          { title: "Reported activity", value: "reported" },
          { title: "Verified completion", value: "completed" },
          { title: "Measured outcome", value: "measured" },
        ],
      },
      validation: (r) => r.required(),
      description:
        "An announcement is not completion. A measured outcome needs a measurement source.",
    }),
    defineField({
      name: "description",
      type: "bilingualText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "His documented role",
      type: "bilingualText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "evidenceLimits",
      title: "What the evidence does not establish",
      type: "bilingualText",
      validation: (r) => r.required(),
    }),
    sourcesField,
    ...reviewFields,
  ],
  preview: { select: { title: "title.en", subtitle: "status" } },
});

const timelineEvent = defineType({
  name: "timelineEvent",
  title: "Roots timeline event",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Date / period label",
      type: "bilingualString",
      validation: (r) => r.required(),
      description:
        "Use only the precision established by the evidence, e.g. “2023” or “Early career”.",
    }),
    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: "label",
      type: "bilingualString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "detail",
      type: "bilingualText",
      validation: (r) => r.required(),
    }),
    sourcesField,
    ...reviewFields,
  ],
  orderings: [
    {
      title: "Timeline order",
      name: "timelineOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: { select: { title: "label.en", subtitle: "date.en" } },
});

const provenanceImage = defineType({
  name: "provenanceImage",
  title: "Image with rights record",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Image description",
      type: "bilingualString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "credit",
      title: "Photographer / owner credit",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "provenance",
      title: "Original image / provenance URL",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "permission",
      title: "Permission / licence evidence",
      type: "text",
      description:
        "Record the licence or where written permission is held. Never paste private correspondence or credentials.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rightsStatus",
      title: "Rights status",
      type: "string",
      initialValue: "unconfirmed",
      options: {
        list: [
          { title: "Unconfirmed — do not publish", value: "unconfirmed" },
          { title: "Written permission obtained", value: "permission" },
          { title: "Open licence (document terms above)", value: "licensed" },
          {
            title: "Public domain (document basis above)",
            value: "public-domain",
          },
        ],
      },
      validation: (r) => r.required(),
    }),
  ],
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Legacy archive",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "creator",
      title: "Optional creator attribution",
      type: "object",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "bio", type: "bilingualText" }),
        defineField({
          name: "url",
          type: "url",
          validation: (r) => r.uri({ scheme: ["https", "http"] }),
        }),
      ],
    }),
    defineField({
      name: "correctionEmail",
      title: "Public corrections email",
      type: "string",
      validation: (r) => r.email(),
      description: "Optional. Use an authorised public inbox only.",
    }),
    defineField({
      name: "portrait",
      type: "provenanceImage",
      description:
        "Optional. Public builds must exclude portraits with unconfirmed rights.",
    }),
    ...reviewFields,
  ],
});

export const schemaTypes = [
  bilingualString,
  bilingualText,
  provenanceImage,
  source,
  achievement,
  timelineEvent,
  siteSettings,
];
