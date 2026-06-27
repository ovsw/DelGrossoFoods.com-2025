import assert from "node:assert/strict";
import test from "node:test";

import { allLineSlugs, toLineSlug } from "../config/sauce-taxonomy";
import {
  parseSearchParams as parseProductSearchParams,
  serializeStateToParams as serializeProductStateToParams,
} from "./products/url";
import {
  parseSearchParams as parseSauceSearchParams,
  serializeStateToParams as serializeSauceStateToParams,
} from "./sauces/url";

test("uses ultra-premium as the canonical product line slug", () => {
  assert.equal(toLineSlug("Ultra-Premium"), "ultra-premium");
  assert.deepEqual(allLineSlugs, ["original", "organic", "ultra-premium"]);
});

test("serializes sauce product line filters with ultra-premium", () => {
  const params = serializeSauceStateToParams({
    search: "",
    productLine: ["ultra-premium"],
    sauceType: "all",
    sort: "az",
  });

  assert.equal(params.toString(), "productLine=ultra-premium");
});

test("serializes store product line filters with ultra-premium", () => {
  const params = serializeProductStateToParams({
    search: "",
    packaging: [],
    productLine: ["ultra-premium"],
    sauceType: "all",
    sort: "az",
  });

  assert.equal(params.toString(), "productLine=ultra-premium");
});

test("normalizes old premium query params to ultra-premium", () => {
  assert.deepEqual(
    parseSauceSearchParams({ productLine: "premium" }).productLine,
    ["ultra-premium"],
  );
  assert.deepEqual(
    parseProductSearchParams({ productLine: "premium" }).productLine,
    ["ultra-premium"],
  );
});
