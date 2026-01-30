import { Box, Flex, Stack, Text, TextInput } from "@sanity/ui";
import type { ForwardedRef, MutableRefObject } from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { NumberInputProps } from "sanity";
import { set, unset } from "sanity";

function assignRef(
  ref:
    | ForwardedRef<HTMLInputElement>
    | MutableRefObject<HTMLInputElement | null>
    | undefined,
  value: HTMLInputElement | null,
): void {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  (ref as MutableRefObject<HTMLInputElement | null>).current = value;
}

export const USDPriceInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function USDPriceInput(props, forwardedRef) {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const { elementProps, onChange, value, readOnly } = props;

    useEffect(() => {
      assignRef(elementProps?.ref, internalRef.current);
    }, [elementProps?.ref]);

    // Track the display value separately from the actual value
    const [displayValue, setDisplayValue] = useState<string>("");

    // Initialize and update display value when props.value changes
    useEffect(() => {
      if (typeof value === "number") {
        setDisplayValue(value.toFixed(2));
      } else {
        setDisplayValue("");
      }
    }, [value]);

    // Handle changes to maintain both the display format and the actual value
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        // Allow empty input
        if (!inputValue) {
          setDisplayValue("");
          onChange(unset());
          elementProps?.onChange?.(event);
          return;
        }

        // Only allow numeric input with decimal point
        if (!/^-?\d*\.?\d*$/.test(inputValue)) {
          elementProps?.onChange?.(event);
          return;
        }

        setDisplayValue(inputValue);

        // Convert to number for the actual value
        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
          onChange(set(numericValue));
        }
        elementProps?.onChange?.(event);
      },
      [elementProps, onChange],
    );

    // Handle blur to format the display value
    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (displayValue && !isNaN(parseFloat(displayValue))) {
          const formatted = parseFloat(displayValue).toFixed(2);
          setDisplayValue(formatted);
          onChange(set(parseFloat(formatted)));
        }
        elementProps?.onBlur?.(event);
      },
      [displayValue, elementProps, onChange],
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        elementProps?.onFocus?.(event);
      },
      [elementProps],
    );

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        assignRef(forwardedRef, node);
        assignRef(elementProps?.ref, node);
      },
      [forwardedRef, elementProps?.ref],
    );

    const elementRest = elementProps ? { ...elementProps, ref: undefined } : {};

    return (
      <Stack space={3}>
        <Flex align="center">
          <Box marginRight={2}>
            <Text size={2}>$</Text>
          </Box>
          <Box flex={1}>
            <TextInput
              {...elementRest}
              value={displayValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              ref={setRef}
              readOnly={readOnly}
              type="text"
              placeholder="0.00"
            />
          </Box>
        </Flex>
      </Stack>
    );
  },
);

USDPriceInput.displayName = "USDPriceInput";
