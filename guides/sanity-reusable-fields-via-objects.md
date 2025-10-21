<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# in sanity, How can I leverage object definitions to create groups of reusable fields which I can then apply in the schema of multiple document types?

In Sanity, you can leverage **object definitions** to build **reusable groups of fields** that can be shared across multiple document types. This lets you keep your schema DRY (Don’t Repeat Yourself), consistent, and easier to maintain.

### Creating reusable field groups with object definitions

Define a **custom object type** that contains a set of fields you reuse across schemas. Create a separate file, such as `seoFields.js`:

```js
// schemas/objects/seoFields.js
export default {
  name: "seoFields",
  title: "SEO Fields",
  type: "object",
  fields: [
    { name: "seoTitle", title: "SEO Title", type: "string" },
    { name: "seoDescription", title: "SEO Description", type: "text" },
    { name: "seoImage", title: "SEO Image", type: "image" },
  ],
};
```

Then, in any document schema (e.g., `blogPost.js`):

```js
import seoFields from "../objects/seoFields";

export default {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "body", title: "Body", type: "blockContent" },
    { name: "seo", title: "SEO", type: "seoFields" }, // reuse the object
  ],
};
```

This approach allows you to manage all SEO-related fields from one definition file and reuse it anywhere.[^1_3][^1_9]

### Combining with field groups or fieldsets (for Studio UI organization)

If you want to visually **group** those reusable fields in Sanity Studio:

- Use **fieldsets** inside the object definition to make collapsible UI sections.
- Or, use **field groups** at the document level to organize fields from different objects into tabs or panels:

```js
groups: [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo', title: 'SEO' },
],
fields: [
  { name: 'title', title: 'Title', type: 'string', group: 'content' },
  { name: 'body', title: 'Body', type: 'blockContent', group: 'content' },
  { name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo' },
]
```

This doesn’t alter the stored data—only the layout in the Studio UI.[^1_2][^1_3]

### Summary

To create reusable field groups in Sanity:

1. Define shared fields within an **object type**.
2. Import and reference that object within multiple document schemas.
3. Optionally, add **fieldsets** or **groups** to organize the fields in the Studio UI.

This modular structure ensures consistent data modeling, easier validation updates, and cleaner schema management.[^1_1][^1_9][^1_2][^1_3]
<span style="display:none">[^1_10][^1_4][^1_5][^1_6][^1_7][^1_8]</span>

<div align="center">⁂</div>

[^1_1]: https://www.halo-lab.com/blog/creating-schema-in-sanity

[^1_2]: https://www.sanity.io/docs/studio/field-groups

[^1_3]: https://www.sanity.io/docs/studio/object-type

[^1_4]: https://stackoverflow.com/questions/77704750/in-sanity-schema-type-definition-how-can-you-define-a-field-of-unknown-propertie

[^1_5]: https://stackoverflow.com/questions/73453205/sanity-io-reusable-schema-field-types

[^1_6]: https://devdotun.hashnode.dev/a-beginners-guide-to-flexible-content-management-using-sanityio

[^1_7]: https://github.com/rdunk/sanity-schema-builder

[^1_8]: https://www.sanity.io/docs/studio/schema-types

[^1_9]: https://www.sanity.io/answers/how-to-reuse-schema-sections-in-sanity-io

[^1_10]: https://katiekodes.com/customizing-sanity-studio/
