import { useEffect, useMemo } from "react";
import type { StringInputProps } from "sanity";
import { set, useFormValue } from "sanity";

export interface AltTextFromFieldOptions {
  sourceField?: string;
  template?: string;
}

export function AltTextFromField(props: StringInputProps) {
  // Get configuration options from schema
  const options = (props.schemaType.options || {}) as AltTextFromFieldOptions;
  const sourceField = options.sourceField || "name";
  const template = options.template || "${value}";

  const { onChange, renderDefault, schemaType, value, elementProps } = props;

  // Support dotted paths so we can reference nested fields if needed.
  const sourcePath = useMemo(
    () => sourceField.split(".").filter((segment) => segment.length > 0),
    [sourceField],
  );

  // Pull the source field value from the document form state.
  const sourceValue = useFormValue(sourcePath) as string | undefined;

  const isReadOnly = Boolean(schemaType.readOnly || elementProps?.readOnly);

  useEffect(() => {
    if (isReadOnly) {
      return;
    }

    if (typeof sourceValue !== "string") {
      return;
    }

    const trimmedSource = sourceValue.trim();
    const calculatedValue = trimmedSource
      ? template.split("${value}").join(trimmedSource)
      : "";

    if (value === calculatedValue) {
      return;
    }

    onChange(set(calculatedValue));
  }, [isReadOnly, onChange, sourceValue, template, value]);

  return renderDefault(props);
}
