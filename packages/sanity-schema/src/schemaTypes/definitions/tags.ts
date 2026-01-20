import { defineArrayMember, defineType } from "sanity";
import { TagsInput } from "../../components/inputs/tags-input/tags-input";

export const tags = defineType({
  name: "tags",
  title: "Tags",
  description: "A reusable tag list input that stores labeled values.",
  type: "array",
  components: {
    input: TagsInput as any,
  },
  of: [defineArrayMember({ type: "tag" })],
});
