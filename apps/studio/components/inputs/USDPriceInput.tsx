import { Box, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import type { NumberInputProps } from "sanity";
import { set, unset } from "sanity";

export function USDPriceInput(props: NumberInputProps) {
  // Track the display value separately from the actual value
  const [displayValue, setDisplayValue] = useState<string>("");
  const { onChange, value } = props;

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
        return;
      }

      // Only allow numeric input with decimal point
      if (!/^-?\d*\.?\d*$/.test(inputValue)) {
        return;
      }

      setDisplayValue(inputValue);

      // Convert to number for the actual value
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        onChange(set(numericValue));
      }
    },
    [onChange],
  );

  // Handle blur to format the display value
  const handleBlur = useCallback(() => {
    if (displayValue && !isNaN(parseFloat(displayValue))) {
      const formatted = parseFloat(displayValue).toFixed(2);
      setDisplayValue(formatted);
      onChange(set(parseFloat(formatted)));
    }
  }, [displayValue, onChange]);

  return (
    <Stack space={3}>
      <Flex align="center">
        <Box marginRight={2}>
          <Text size={2}>$</Text>
        </Box>
        <Box flex={1}>
          <TextInput
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            placeholder="0.00"
          />
        </Box>
      </Flex>
    </Stack>
  );
}
