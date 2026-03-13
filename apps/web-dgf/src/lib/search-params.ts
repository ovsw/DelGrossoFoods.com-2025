type SearchParamsRecord = Record<string, string | string[] | undefined>;
type SearchParamsSource = Pick<URLSearchParams, "getAll" | "keys">;

export function searchParamsToRecord(
  searchParams: SearchParamsSource,
): SearchParamsRecord {
  const record: SearchParamsRecord = {};

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);

    if (values.length === 0) continue;

    record[key] = values.length === 1 ? values[0] : values;
  }

  return record;
}
