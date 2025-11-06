import { useEffect, useMemo } from "react";
import type {
  ConditionalPropertyCallbackContext,
  StringInputProps,
} from "sanity";
import { set, useFormValue } from "sanity";

export interface AltTextFromFieldOptions {
  sourceField?: string;
  template?: string;
}

type ConditionalContextProps = {
  document?: ConditionalPropertyCallbackContext["document"];
  parent?: ConditionalPropertyCallbackContext["parent"];
  currentUser?: ConditionalPropertyCallbackContext["currentUser"];
};

function resolveReadOnly(props: StringInputProps): boolean {
  const { elementProps, schemaType, value } = props;

  if (typeof elementProps?.readOnly === "boolean") {
    return elementProps.readOnly;
  }

  const schemaReadOnly = schemaType.readOnly;

  if (typeof schemaReadOnly === "function") {
    const contextualProps = props as StringInputProps & ConditionalContextProps;

    const context: ConditionalPropertyCallbackContext = {
      document: contextualProps.document,
      parent: contextualProps.parent,
      value,
      currentUser: contextualProps.currentUser ?? null,
    };

    return Boolean(schemaReadOnly(context));
  }

  return Boolean(schemaReadOnly);
}

export function AltTextFromField(props: StringInputProps) {
  // Get configuration options from schema
  const options = (props.schemaType.options || {}) as AltTextFromFieldOptions;
  const sourceField = options.sourceField || "name";
  const template = options.template || "${value}";

  const { onChange, renderDefault, value } = props;

  // Support dotted paths so we can reference nested fields if needed.
  const sourcePath = useMemo(
    () => sourceField.split(".").filter((segment) => segment.length > 0),
    [sourceField],
  );

  // Pull the source field value from the document form state.
  const sourceValue = useFormValue(sourcePath) as string | undefined;

  const isReadOnly = resolveReadOnly(props);

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
