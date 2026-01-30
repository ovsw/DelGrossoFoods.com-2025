import type { InputType, Tag } from "./types";

export const isSchemaMulti = (type: InputType): boolean => {
  return type.jsonType !== "object";
};

export const isSchemaReference = (type: InputType): boolean => {
  return "to" in type || ("of" in type && type.of[0] && "to" in type.of[0]);
};

export const filterUniqueTags = (tags: Tag[] = []): Tag[] => {
  const flattened = tags.flat(Infinity);

  return flattened.filter((firstTag, index) => {
    const firstTagStringified = JSON.stringify({
      label: firstTag.label,
      value: firstTag.value,
    });

    return (
      index ===
      flattened.findIndex((secondTag) => {
        return (
          JSON.stringify({ label: secondTag.label, value: secondTag.value }) ===
          firstTagStringified
        );
      })
    );
  });
};

export const get = <DefaultValue extends unknown>(
  object: Record<string, unknown> | unknown,
  path: string | string[],
  defaultValue?: DefaultValue,
): unknown => {
  if (!object) return defaultValue;

  let props: string[] | false = false;
  let prop: string | undefined;

  if (Array.isArray(path)) props = path.slice(0);
  if (typeof path === "string") props = path.split(".");
  if (!Array.isArray(props))
    throw new Error("path must be an array or a string");

  let obj: object | unknown = object;
  while (props.length) {
    prop = props.shift();
    if (!prop) return defaultValue;
    if (!obj) return defaultValue;
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
      return defaultValue;
    }
    if (!(prop in obj)) return defaultValue;
    obj = (obj as { [key: string]: unknown })[prop];
  }

  return obj;
};

function prototypeCheck(prop: string) {
  return !(
    prop === "__proto__" ||
    prop === "constructor" ||
    prop === "prototype"
  );
}

export const setAtPath = <Value extends unknown>(
  object: Record<string, unknown>,
  path: string | string[],
  value: Value,
): boolean => {
  let props: string[] | false = false;

  if (Array.isArray(path)) props = path.slice(0);
  if (typeof path === "string") props = path.split(".");
  if (!Array.isArray(props))
    throw new Error("path must be an array or a string");

  const lastProp = props.pop();
  if (!lastProp) return false;
  if (!prototypeCheck(lastProp)) {
    throw new Error("setting of prototype values not supported");
  }

  let thisProp: string | undefined;
  let obj = object;
  while ((thisProp = props.shift())) {
    if (!prototypeCheck(thisProp)) {
      throw new Error("setting of prototype values not supported");
    }
    if (!thisProp) return false;
    if (!(thisProp in obj)) obj[thisProp] = {};
    obj = obj[thisProp] as Record<string, unknown>;
    if (!obj || typeof obj !== "object") return false;
  }

  obj[lastProp] = value;

  return true;
};

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}
