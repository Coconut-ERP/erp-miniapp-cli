import type { ErpClient, ObjectHandle } from "erp-sdk";
import { declaration, LOOKUP_FIELDS, OBJECT_KEYS, OBJECTS, type ObjectKey } from "@/lib/erp/schema";

export type AppObjects = Record<ObjectKey, ObjectHandle>;

function hasField(handle: ObjectHandle, name: string): boolean {
  const wanted = name.toLowerCase();
  return handle.fields.some((field) => field.name.toLowerCase() === wanted);
}

/**
 * Resolves declared tables — never creates them. Optional lookups only warn.
 */
export async function resolveObjects(app: ErpClient): Promise<AppObjects> {
  const byName = await app.assertSchema(declaration());

  const objects = {} as AppObjects;
  for (const key of OBJECT_KEYS) {
    const handle = byName[OBJECTS[key]];
    if (!handle) {
      throw new Error(`Object "${OBJECTS[key]}" is missing from the schema declaration`);
    }
    objects[key] = handle;
  }

  const missingLookups = LOOKUP_FIELDS.filter(
    (spec) => !hasField(objects[spec.object], spec.field),
  );
  if (missingLookups.length > 0) {
    console.warn(
      `[erp] missing ${missingLookups.length} lookup field(s): ` +
        `${missingLookups.map((spec) => `${OBJECTS[spec.object]}.${spec.field}`).join(", ")}. ` +
        "Lookups cannot be declared in schema.json — create them by hand in the workspace.",
    );
  }

  return objects;
}
