import { useEffect } from "react";
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

  const { onChange, renderDefault } = props;

  // Get values from other fields (assuming these are root-level fields)
  const sourceValue = useFormValue([sourceField]) as string | undefined;

  useEffect(() => {
    // Calculate the value using the template
    const calculatedValue = sourceValue
      ? template.replace("${value}", sourceValue)
      : "";
    // Use the set patch to update the field's value
    onChange(set(calculatedValue));
  }, [sourceValue, onChange, template]); // Re-run effect when these dependencies change

  // Render the default input, which will now show the updated value
  return renderDefault(props);
}
