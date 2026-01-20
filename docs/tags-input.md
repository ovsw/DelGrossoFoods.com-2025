# Tags Input (Sanity Studio)

This repo includes a reusable tags input for Sanity Studio v4 (React 19) that mirrors
the behavior and UI of the MIT-licensed `sanity-plugin-tags` package, adapted for our
monorepo and current dependencies. See the upstream reference for behavior details:
https://github.com/pcbowers/sanity-plugin-tags

## What it provides

- Reusable schema types: `tag` and `tags`.
- Multi-tag UI with autocomplete and optional creation.
- Predefined tag lists.
- Options to source tags from related fields or reference documents.
- Custom label/value keys and custom validation hooks.

## Usage

### 1) Add to a field (multi-select)

```ts
defineField({
  name: "states",
  title: "States",
  type: "tags",
  options: {
    predefinedTags: [
      { label: "New York", value: "new-york" },
      { label: "Pennsylvania", value: "pennsylvania" },
    ],
    allowCreate: false,
  },
});
```

### 2) Add to a field (single-select)

```ts
defineField({
  name: "category",
  title: "Category",
  type: "tag",
  options: {
    predefinedTags: [
      { label: "Retail", value: "retail" },
      { label: "Wholesale", value: "wholesale" },
    ],
    allowCreate: false,
  },
});
```

## Supported options

These options mirror the original plugin:

- `predefinedTags`: array/function of tags.
- `includeFromReference`: document type name (string).
- `includeFromRelated`: field name (string).
- `customLabel`: custom label key (default `"label"`).
- `customValue`: custom value key (default `"value"`).
- `allowCreate`: allow inline creation (default `true`).
- `onCreate`: transform new tag before save.
- `checkValid`: custom validation for new tags.
- `reactSelectOptions`: pass-through options to react-select.

## Notes

- Tags are stored as objects with `{ label, value }` by default.
- Reference-based tags do not support inline creation or predefined tags.
- This input is implemented in `packages/sanity-schema/src/components/inputs/tags-input/`.
