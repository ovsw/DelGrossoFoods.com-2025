import { defineField, defineType } from "sanity";
import { TagsInput } from "../../components/inputs/tags-input/tags-input";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  description: "A labeled value used by tag inputs across the studio.",
  type: "object",
  components: {
    input: TagsInput as any,
  },
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: "The stored value for this tag.",
      type: "string",
    }),
    defineField({
      name: "label",
      title: "Label",
      description: "The human-readable label shown to editors.",
      type: "string",
    }),
  ],
});
