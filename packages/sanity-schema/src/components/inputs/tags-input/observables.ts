import type { SanityClient } from "./client";
import type { Observable } from "rxjs";
import { defer, from, pipe } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import type {
  GeneralTag,
  PredefinedTags,
  RefTag,
  Tag,
  UnrefinedTags,
} from "./types";
import { listenOptions } from "./client";
import { filterUniqueTags } from "./helpers";
import { prepareTagsAsList } from "./mutators";

interface RefineTagsPipeInput {
  client: SanityClient;
  customLabel?: string;
  customValue?: string;
}

const refineTagsPipe = ({
  client,
  customLabel = "label",
  customValue = "value",
}: RefineTagsPipeInput) =>
  pipe(
    map(
      (val) => (Array.isArray(val) ? val.flat(Infinity) : val) as UnrefinedTags,
    ),
    switchMap((val) =>
      prepareTagsAsList({ client, tags: val, customLabel, customValue }),
    ),
    map((val) => filterUniqueTags(val)),
  );

interface GetGeneralObservableInput {
  client: SanityClient;
  query: string;
  params: {
    [key: string]: unknown;
  };
  customLabel?: string;
  customValue?: string;
}

const getGeneralObservable = ({
  client,
  query,
  params,
  customLabel = "label",
  customValue = "value",
}: GetGeneralObservableInput) => {
  return client
    .listen<NonNullable<UnrefinedTags>>(query, params, listenOptions)
    .pipe(
      switchMap(() => client.fetch<UnrefinedTags>(query, params)),
      refineTagsPipe({ client, customLabel, customValue }),
    );
};

interface GetSelectedTagsInput<IsMulti extends boolean = boolean> {
  client: SanityClient;
  tags: UnrefinedTags;
  isMulti: IsMulti;
  customLabel?: string;
  customValue?: string;
}

export function getSelectedTags<IsMulti extends true>(
  params: GetSelectedTagsInput<IsMulti>,
): Observable<Tag[]>;
export function getSelectedTags<IsMulti extends false>(
  params: GetSelectedTagsInput<IsMulti>,
): Observable<Tag>;
export function getSelectedTags<IsMulti extends boolean>(
  params: GetSelectedTagsInput<IsMulti>,
): Observable<Tag | Tag[]>;
export function getSelectedTags<IsMulti extends boolean>({
  client,
  tags,
  isMulti,
  customLabel = "label",
  customValue = "value",
}: GetSelectedTagsInput<IsMulti>): Observable<Tag | Tag[]> {
  const tagFunction = async () => tags;

  return defer(() => from(tagFunction())).pipe(
    refineTagsPipe({ client, customLabel, customValue }),
    map((val) => (isMulti ? val : val[0])),
  );
}

const predefinedTagWrapper = async (
  predefinedTags:
    | (() => Promise<GeneralTag | GeneralTag[] | RefTag | RefTag[]>)
    | (() => GeneralTag | GeneralTag[] | RefTag | RefTag[]),
): Promise<GeneralTag[] | RefTag[]> => {
  const tags = await predefinedTags();
  if (!Array.isArray(tags)) return [tags] as GeneralTag[] | RefTag[];
  return tags as GeneralTag[] | RefTag[];
};

interface GetPredefinedTagsInput {
  client: SanityClient;
  predefinedTags: PredefinedTags;
  customLabel?: string;
  customValue?: string;
}

export const getPredefinedTags = ({
  client,
  predefinedTags,
  customLabel = "label",
  customValue = "value",
}: GetPredefinedTagsInput): Observable<Tag[]> => {
  const tagFunction =
    predefinedTags instanceof Function
      ? predefinedTags
      : async () => predefinedTags;

  return defer(() =>
    from(predefinedTagWrapper(tagFunction)).pipe(
      refineTagsPipe({ client, customLabel, customValue }),
    ),
  );
};

interface GetTagsFromReferenceInput {
  client: SanityClient;
  document: string;
  customLabel?: string;
  customValue?: string;
}

export const getTagsFromReference = ({
  client,
  document,
  customLabel = "label",
  customValue = "value",
}: GetTagsFromReferenceInput): Observable<Tag[]> => {
  const query = `
  *[ _type == $document && defined(@[$customLabel]) && defined(@[$customValue])] {
    _id,
    "value": @[$customValue],
    "label": @[$customLabel]
  }
  `;

  const params = {
    document,
    customLabel: customLabel.split(".")[0],
    customValue: customValue.split(".")[0],
  };

  return getGeneralObservable({
    client,
    query,
    params,
    customLabel,
    customValue,
  });
};

interface GetTagsFromRelatedInput {
  client: SanityClient;
  documentType: string;
  field: string;
  isMulti: boolean;
  customLabel?: string;
  customValue?: string;
}

export const getTagsFromRelated = ({
  client,
  documentType,
  field,
  isMulti,
  customLabel = "label",
  customValue = "value",
}: GetTagsFromRelatedInput): Observable<Tag[]> => {
  const query = `
  *[
    _type == $documentType &&
    defined(@[$field]) &&
    defined(@[$field][]) == $isMulti &&
    (
      (!$isMulti && defined(@[$field]->[$customLabel]) && defined(@[$field]->[$customValue])) ||
      (!$isMulti && defined(@[$field][$customLabel]) && defined(@[$field][$customValue])) ||
      ($isMulti && defined(@[$field][]->[$customLabel]) && defined(@[$field][]->[$customValue])) ||
      ($isMulti && defined(@[$field][][$customLabel]) && defined(@[$field][][$customValue]))
    )
  ][$field]
  `;

  const params = {
    documentType,
    field,
    isMulti,
    customLabel: customLabel.split(".")[0],
    customValue: customValue.split(".")[0],
  };

  return getGeneralObservable({
    client,
    query,
    params,
    customLabel,
    customValue,
  });
};
