import { useCallback, useEffect, useState } from "react";
import type { Tag } from "./types";
import { filterUniqueTags } from "./helpers";

type LoadingOptions = { [key: string]: boolean };
interface UseLoadingInput {
  initialLoadingOptions?: LoadingOptions;
  initialState?: boolean;
}

export const useLoading = ({
  initialLoadingOptions = {},
  initialState = true,
}: UseLoadingInput): [
  boolean,
  LoadingOptions,
  (properties: LoadingOptions) => void,
] => {
  const [loadingOptions, setLoadingOptions] = useState(initialLoadingOptions);
  const [isLoading, setIsLoading] = useState(initialState);

  useEffect(() => {
    const loaded = Object.values(loadingOptions).some(Boolean);
    setIsLoading(loaded);
  }, [loadingOptions]);

  const setLoadOption = useCallback((properties: LoadingOptions) => {
    setLoadingOptions((oldValue) => ({ ...oldValue, ...properties }));
  }, []);

  return [isLoading, loadingOptions, setLoadOption];
};

type Options = { [key: string]: Tag[] };
interface UseOptionsInput {
  initialState?: Tag[];
}

export const useOptions = ({
  initialState = [],
}: UseOptionsInput): [Tag[], Options, (properties: Options) => void] => {
  const [options, setOptions] = useState(initialState);
  const [groupOptions, setGroupOptions] = useState({} as Options);

  useEffect(() => {
    const opts: Tag[] = [];

    Object.values(groupOptions).forEach((group) => {
      if (Array.isArray(group)) opts.push(...group);
    });

    setOptions(filterUniqueTags(opts));
  }, [groupOptions]);

  const setTagOption = useCallback((properties: Options) => {
    setGroupOptions((oldValue) => ({ ...oldValue, ...properties }));
  }, []);

  return [options, groupOptions, setTagOption];
};
