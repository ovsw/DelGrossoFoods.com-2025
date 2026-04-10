import assert from "node:assert/strict";
import test from "node:test";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "testProject";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";

const mainImageAssetId = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x1000-jpg";

const { resolveRecipeSeo } = await import(
  "@workspace/sanity-config/recipe-seo"
);

test("resolves title from seoTitle when present", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "baked-ziti",
    name: "Baked Ziti",
    seoTitle: "Best Baked Ziti",
  });

  assert.equal(resolved.title, "Best Baked Ziti");
});

test("falls back to recipe name when seoTitle is blank after trimming", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "baked-ziti",
    name: "Baked Ziti",
    seoTitle: "   ",
  });

  assert.equal(resolved.title, "Baked Ziti");
});

test("resolves description from seoDescription when present", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "baked-ziti",
    name: "Baked Ziti",
    seoDescription: "Custom recipe description.",
  });

  assert.equal(resolved.description, "Custom recipe description.");
});

test("falls back to the recipe template when seoDescription is blank", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "baked-ziti",
    name: "Baked Ziti",
    seoDescription: "   ",
  });

  assert.equal(
    resolved.description,
    "Learn how to make Baked Ziti with DelGrosso sauces.",
  );
});

test("resolves image from seoImage when present", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "baked-ziti",
    name: "Baked Ziti",
    seoImage: "https://cdn.example.com/seo-image.jpg",
    mainImage: { id: mainImageAssetId },
  });

  assert.equal(resolved.image, "https://cdn.example.com/seo-image.jpg");
});

test("falls back to mainImage when seoImage is blank", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "baked-ziti",
    name: "Baked Ziti",
    seoImage: "   ",
    mainImage: { id: mainImageAssetId },
  });

  assert.match(
    resolved.image ?? "",
    /^https:\/\/cdn\.sanity\.io\/images\/testProject\/production\//,
  );
});

test("falls back to the existing slug-based recipe title when name is missing", () => {
  const resolved = resolveRecipeSeo({
    _id: "recipe-1",
    _type: "recipe",
    slug: "/recipes/baked-ziti",
    name: "   ",
  });

  assert.equal(resolved.title, "Recipe: baked-ziti");
  assert.equal(resolved.description, "Discover delicious family recipes.");
});
