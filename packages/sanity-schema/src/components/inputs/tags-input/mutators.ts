import type { SanityClient } from "./client";
import type {
  GeneralTag,
  RefinedTags,
  RefTag,
  Tag,
  UnrefinedTags,
} from "./types";
import { get, isPlainObject, setAtPath } from "./helpers";

interface PrepareTagInput {
  customLabel?: string;
  customValue?: string;
}

const prepareTag =
  ({ customLabel = "label", customValue = "value" }: PrepareTagInput) =>
  (tag: GeneralTag) => {
    const tempTag: Tag = {
      ...tag,
      _type: "tag",
      _key: String(tag.value ?? tag.label ?? tag._id ?? tag._key ?? "tag"),
      _labelTemp: tag.label,
      _valueTemp: tag.value,
      label: get(tag, customLabel) as string,
      value: get(tag, customValue) as string,
    };

    return tempTag;
  };

interface RevertTagInput<IsReference extends boolean = boolean> {
  customLabel?: string;
  customValue?: string;
  isReference: IsReference;
}

function revertTag<IsReference extends true>(
  params: RevertTagInput<IsReference>,
): (tag: Tag) => RefTag;
function revertTag<IsReference extends false>(
  params: RevertTagInput<IsReference>,
): (tag: Tag) => GeneralTag;
function revertTag<IsReference extends boolean>(
  params: RevertTagInput<IsReference>,
): (tag: Tag) => RefTag | GeneralTag;
function revertTag<IsReference extends boolean>({
  customLabel = "label",
  customValue = "value",
  isReference,
}: RevertTagInput<IsReference>) {
  return (tag: Tag): RefTag | GeneralTag => {
    if (isReference === true) {
      return {
        _ref: tag._id ?? tag.value,
        _type: "reference",
      };
    }

    const tempTag: GeneralTag = {
      ...tag,
      label: tag._labelTemp,
      value: tag._valueTemp,
    };

    setAtPath(tempTag, customLabel, tag.label);
    setAtPath(tempTag, customValue, tag.value);

    delete tempTag._labelTemp;
    delete tempTag._valueTemp;
    if (tempTag.label === undefined) delete tempTag.label;
    if (tempTag.value === undefined) delete tempTag.value;

    return tempTag;
  };
}

interface PrepareTagsInput<TagType extends UnrefinedTags = UnrefinedTags> {
  client: SanityClient;
  tags: TagType;
  customLabel?: string;
  customValue?: string;
}

export const prepareTags = async <TagType extends UnrefinedTags>({
  client,
  tags,
  customLabel = "label",
  customValue = "value",
}: PrepareTagsInput<TagType>): Promise<RefinedTags> => {
  const prepare = prepareTag({ customLabel, customValue });

  if (tags === undefined || tags === null) return undefined;
  if (Array.isArray(tags) && !tags.length) return [];

  if (
    Array.isArray(tags) &&
    tags.length > 0 &&
    "_ref" in tags[0] &&
    "_type" in tags[0]
  ) {
    return (
      await client.fetch<GeneralTag[]>("*[_id in $refs]", {
        refs: (tags as RefTag[]).map((tag) => tag._ref),
      })
    ).map(prepare);
  }

  if (Array.isArray(tags)) return (tags as GeneralTag[]).map(prepare);

  if (isPlainObject(tags) && "_ref" in tags && "_type" in tags) {
    const refTag = tags as unknown as RefTag;
    return prepare(
      await client.fetch<GeneralTag>("*[_id == $ref][0]", { ref: refTag._ref }),
    );
  }

  return prepare(tags as GeneralTag);
};

export const prepareTagsAsList = async <TagType extends UnrefinedTags>(
  preparedTagsOptions: PrepareTagsInput<TagType>,
): Promise<Tag[]> => {
  const preparedTags = await prepareTags(preparedTagsOptions);

  if (preparedTags === undefined) return [];
  if (!Array.isArray(preparedTags)) return [preparedTags];
  return preparedTags;
};

interface RevertTagsInput<
  IsReference extends boolean = boolean,
  IsMulti extends boolean = boolean,
> {
  tags: RefinedTags;
  customLabel?: string;
  customValue?: string;
  isMulti: IsMulti;
  isReference: IsReference;
}

export function revertTags<IsReference extends true, IsMulti extends true>(
  params: RevertTagsInput<IsReference, IsMulti>,
): RefTag[];
export function revertTags<IsReference extends true, IsMulti extends false>(
  params: RevertTagsInput<IsReference, IsMulti>,
): RefTag | undefined;
export function revertTags<IsReference extends false, IsMulti extends true>(
  params: RevertTagsInput<IsReference, IsMulti>,
): GeneralTag[];
export function revertTags<IsReference extends false, IsMulti extends false>(
  params: RevertTagsInput<IsReference, IsMulti>,
): GeneralTag | undefined;
export function revertTags<IsReference extends boolean, IsMulti extends false>(
  params: RevertTagsInput<IsReference, IsMulti>,
): RefTag | GeneralTag | undefined;
export function revertTags<IsReference extends boolean, IsMulti extends true>(
  params: RevertTagsInput<IsReference, IsMulti>,
): RefTag[] | GeneralTag[];
export function revertTags<IsReference extends false, IsMulti extends boolean>(
  params: RevertTagsInput<IsReference, IsMulti>,
): GeneralTag | GeneralTag[] | undefined;
export function revertTags<IsReference extends true, IsMulti extends boolean>(
  params: RevertTagsInput<IsReference, IsMulti>,
): RefTag | RefTag[] | undefined;
export function revertTags<
  IsReference extends boolean,
  IsMulti extends boolean,
>(params: RevertTagsInput<IsReference, IsMulti>): UnrefinedTags;
export function revertTags<
  IsReference extends boolean,
  IsMulti extends boolean,
>({
  tags,
  customLabel = "label",
  customValue = "value",
  isMulti,
  isReference,
}: RevertTagsInput<IsReference, IsMulti>): UnrefinedTags {
  const revert = revertTag({ customLabel, customValue, isReference });

  if (tags === undefined) return undefined;

  if (isMulti) {
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    if (isReference) {
      return tagsArray.map(revert) as RefTag[];
    }
    return tagsArray.map(revert) as GeneralTag[];
  }

  const tag = Array.isArray(tags) ? tags[0] : tags;
  if (isReference) {
    return revert(tag) as RefTag | undefined;
  }
  return revert(tag) as GeneralTag | undefined;
}
