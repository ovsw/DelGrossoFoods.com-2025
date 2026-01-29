## Sanity Presentation Mode: Click-to-Edit for Images

### Overview

This section documents how to implement click-to-edit functionality for images in Sanity page builder blocks, ensuring both image clarity and proper navigation to the correct field in the Studio.

### The Problem

When implementing click-to-edit for images in page builder blocks, two common issues arise:

1. **Blurry images** - Images appear as LQIP (Low Quality Image Placeholder) instead of full resolution
2. **Broken click-to-edit** - Clicking images doesn't navigate to the correct field or closes the editor

### The Solution

#### 1. Image Clarity (Avoiding Blurriness)

**✅ DO:**

- Use the simplest possible SanityImage implementation
- Keep the default SanityImage behavior (don't override with extra props)
- Use conditional rendering with `{image && (...)}`

**❌ DON'T:**

- Add `respectSanityCrop={true}` (causes blurriness)
- Add `mode` prop (causes blurriness)
- Add `loading="eager"` or `priority` props (not supported by SanityImage)
- Override the preview/LQIP data

**Working Example:**

```tsx
{
  image && (
    <div className="h-96 w-full self-center">
      <SanityImage
        image={image}
        width={800}
        height={800}
        alt={typeof title === "string" ? title : ""}
        className="max-h-96 w-full rounded-3xl object-cover h-full"
      />
    </div>
  );
}
```

#### 2. Click-to-Edit Functionality

**Required Steps:**

1. **Add Sanity document props to component:**

```tsx
export type FeatureBlockProps = PageBuilderBlockProps<"feature"> & {
  sanityDocumentId?: string;
  sanityDocumentType?: string;
};
```

2. **Create data attribute with correct field path:**

```tsx
// For page builder blocks, the path must include the block key
const imageDataAttribute =
  sanityDocumentId && sanityDocumentType && _key
    ? createDataAttribute({
        id: sanityDocumentId,
        type: sanityDocumentType,
        path: `pageBuilder[_key=="${_key}"].image`, // Critical: include block key
        baseUrl: studioUrl,
        projectId,
        dataset,
      }).toString()
    : undefined;
```

3. **Apply data-sanity attribute to SanityImage:**

```tsx
<SanityImage
  image={image}
  // ... other props
  data-sanity={imageDataAttribute}
/>
```

4. **Update PageBuilder to pass document info:**

```tsx
case "feature": {
  const Component = BLOCK_COMPONENTS.feature;
  return (
    <div key={`feature-${_key}`} data-sanity={dataAttribute}>
      <Component
        {...block}
        isPageTop={isFirstBlock}
        sanityDocumentId={id}
        sanityDocumentType={type}
      />
    </div>
  );
}
```

### Critical Field Path Rules

**For Page Builder Blocks:**

- ✅ Correct: `pageBuilder[_key=="${_key}"].image`
- ❌ Wrong: `image` (too generic, causes navigation issues)

**For Direct Document Fields:**

- ✅ Correct: `mainImage` (for sauce/product cards)
- ✅ Correct: `image` (for simple document fields)

### Common Pitfalls

1. **Wrong Field Path**: Using `"image"` instead of `pageBuilder[_key=="${_key}"].image` causes Sanity to navigate to the wrong field or close the editor entirely.

2. **Over-Engineering**: Adding unnecessary props like `respectSanityCrop`, `mode`, or `loading` causes blurriness. Keep it simple.

3. **Missing Block Key**: The `_key` prop is essential for page builder blocks. Without it, the field path is incorrect.

4. **Conflicting Data Attributes**: Don't create multiple `data-sanity` attributes on the same element. The PageBuilder already creates one for the block wrapper.

### Testing Checklist

- [ ] Image appears clear (not blurry) on page load
- [ ] Image remains clear after dev server restart
- [ ] Clicking image in Presentation mode opens the correct document
- [ ] Clicking image navigates to the page builder section
- [ ] Clicking image focuses on the specific block
- [ ] Clicking image opens the image field for editing
- [ ] Cover vs Fit options still work correctly

### Reference Implementation

See `apps/web-dgf/src/components/systems/pagebuilder/blocks/feature-block.tsx` for the complete working implementation that handles both image clarity and click-to-edit functionality.
