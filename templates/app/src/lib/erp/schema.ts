import { defineSchema, type MiniAppSchema, type SchemaFieldSpec } from "erp-sdk";

/**
 * Display names of objects this mini app needs. Extend as the domain grows.
 * Keep in sync with `declaration()` — `bun run schema` regenerates schema.json.
 */
export const OBJECTS = {
  site: "Site",
} as const;

export type ObjectKey = keyof typeof OBJECTS;

export const OBJECT_KEYS = Object.keys(OBJECTS) as ObjectKey[];

/** Field display names addressed in code — prefer `F.*` over raw strings. */
export const F = {
  site: {
    name: "Name",
    code: "Code",
    status: "Status",
  },
} as const;

export const OPTIONS = {
  siteStatus: ["Active", "Inactive", "Draft"],
} as const;

const select = (options: readonly string[]): SchemaFieldSpec["config"] => ({
  source: "static",
  options: [...options],
});

export const SCALAR_FIELDS: Record<ObjectKey, SchemaFieldSpec[]> = {
  site: [
    { name: F.site.name, type: "text" },
    { name: F.site.code, type: "text" },
    { name: F.site.status, type: "single_select", config: select(OPTIONS.siteStatus) },
  ],
};

export interface RelationSpec {
  object: ObjectKey;
  field: string;
  target: ObjectKey;
}

/** Relation fields declared in schema.json (`config.targetObject` = display name). */
export const RELATION_FIELDS: RelationSpec[] = [
  // Example:
  // { object: "line", field: F.line.factory, target: "factory" },
];

export interface LookupSpec {
  object: ObjectKey;
  field: string;
  via: string;
  target: ObjectKey;
  targetField: string;
}

/**
 * Lookups cannot be declared in schema.json — create them by hand in the
 * workspace. Listed here so boot can warn when they are missing.
 */
export const LOOKUP_FIELDS: LookupSpec[] = [];

/**
 * Declaration that ships as `schema.json`. Lookups are omitted on purpose.
 */
export function declaration(): MiniAppSchema {
  return defineSchema({
    objects: OBJECT_KEYS.map((key, index) => ({
      name: OBJECTS[key],
      position: index,
      fields: [
        ...SCALAR_FIELDS[key],
        ...RELATION_FIELDS.filter((spec) => spec.object === key).map((spec) => ({
          name: spec.field,
          type: "relation" as const,
          config: { targetObject: OBJECTS[spec.target] },
        })),
      ].map((field, position) => ({ ...field, position })),
    })),
  });
}
