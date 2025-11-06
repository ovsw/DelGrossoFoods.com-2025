# SVG Patterns for DecoratedSplitLayout

This directory contains reusable SVG pattern components for the `DecoratedSplitLayout` component.

## Pattern Types

### 1. Repeating Patterns (using SVG `<pattern>`)

Small, tileable patterns that repeat across the background.

**Examples:** Grid, Dots, Diagonal Lines

**Requirements:**

- Must use `<pattern>` element with `patternUnits="userSpaceOnUse"`
- Keep pattern size reasonable (typically 100-300px)
- Ensure edges tile seamlessly

**Template:**

```tsx
export function MyPattern({ patternX, svgX, patternStroke, patternFill }) {
  return (
    <svg className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern
          id="my-pattern"
          x={patternX}
          y={-1}
          width={200}
          height={200}
          patternUnits="userSpaceOnUse"
        >
          {/* Your pattern shape here */}
        </pattern>
      </defs>
      <rect fill="url(#my-pattern)" width="100%" height="100%" />
    </svg>
  );
}
```

### 2. Illustration Patterns (single large background)

Full illustrations used as decorative backgrounds (non-repeating).

**Examples:** Italian Ingredients, Hand-drawn elements

**Requirements:**

- Use `viewBox` to preserve aspect ratio
- Set `preserveAspectRatio="xMidYMid slice"` to cover area
- Keep file size reasonable (<50KB)

**Template:**

```tsx
export function MyIllustration() {
  return (
    <svg
      viewBox="0 0 WIDTH HEIGHT"
      className="absolute inset-0 size-full opacity-10"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Your SVG paths here */}
    </svg>
  );
}
```

## Adding a New Pattern

1. **Create the pattern file**: `my-pattern.tsx`
2. **Export from index**: Add to `index.ts`
3. **Update DecoratedSplitLayout**: Wire it into the theme system
4. **Document**: Add JSDoc comment explaining the pattern

## Best Practices

- ✅ Keep pattern IDs unique (use descriptive names)
- ✅ Use `aria-hidden="true"` on all decorative SVGs
- ✅ Accept color props for flexibility
- ✅ Add JSDoc comments describing the visual style
- ✅ Test pattern on both light and dark backgrounds
- ⚠️ Avoid patterns that are too busy/distracting
- ⚠️ Keep SVG file sizes small for performance

## Examples

See existing patterns:

- `grid-pattern.tsx` - Simple repeating grid lines
- `italian-ingredients-pattern.tsx` - Large illustration background
- `autumn-pattern.tsx` - Organic leaf and branch motifs with autumnal styling
