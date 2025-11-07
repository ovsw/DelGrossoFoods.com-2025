import { defineQuery } from "next-sanity";

import {
  imageFields,
  imageFragment,
  markDefsFragment,
  ogFieldsFragment,
  recipeVideoFragment,
} from "./fragments";

export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const getAllSaucesForIndexQuery = defineQuery(`
  *[_type == "sauce"] | order(name asc){
    _id,
    _type,
    name,
    "slug": slug.current,
    line,
    category,
    "descriptionPlain": pt::text(description),
    "mainImage": {
      "id": mainImage.asset._ref,
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right },
      "alt": mainImage.alt
    }
  }
`);

export const getSaucesByIdsQuery = defineQuery(`
  *[
    _type == "sauce"
    && _id in $sauceIds
    && defined(slug.current)
  ] | order(name asc){
    _id,
    _type,
    name,
    "slug": slug.current,
    line,
    category,
    "descriptionPlain": coalesce(pt::text(description), ""),
    "mainImage": mainImage{
      ${imageFields},
      "alt": coalesce(alt, "")
    }
  }
`);

export const getSauceBySlugQuery = defineQuery(`
  *[_type == "sauce" && slug.current in [$slug, $prefixedSlug]][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    colorHex,
    line,
    category,
    "description": description[]{
      ...,
      _type == "block" => {
        ...,
        ${markDefsFragment}
      },
      _type == "image" => {
        ${imageFields},
        "caption": caption
      }
    },
    "descriptionPlain": coalesce(pt::text(description), ""),
    "mainImage": mainImage{
      ${imageFields},
      "alt": coalesce(alt, "")
    },
    "labelFlatImage": labelFlatImage{
      ${imageFields},
      "alt": coalesce(alt, "")
    },
    authorName,
    "authorImage": authorImage{
      ${imageFields},
      "alt": coalesce(alt, "")
    },
    nutritionalInfo,
    ingredients,
    allergens
  }
`);

export const getAllRecipesForIndexQuery = defineQuery(`
  *[_type == "recipe"] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    tags,
    meat,
    versions,
    "hasVideo": defined(video.asset.asset._ref),
    "categories": array::compact(categories[]->{ _id, title, slug }),
    "descriptionPlain": "",
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right }
    },
    "sauceLines": array::unique((array::compact(dgfSauces[]->line) + array::compact(lfdSauces[]->line)))
  }
`);

export const getRecipesBySauceIdQuery = defineQuery(`
  *[
    _type == "recipe"
    && defined(slug.current)
    && $sauceId != null
    && references($sauceId)
  ] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    tags,
    meat,
    versions,
    "categories": array::compact(categories[]->{ _id, title, slug }),
    "descriptionPlain": "",
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right }
    },
    "sauceLines": array::unique((array::compact(dgfSauces[]->line) + array::compact(lfdSauces[]->line)))
  }
`);

export const getRecipesBySauceIdsQuery = defineQuery(`
  *[
    _type == "recipe"
    && defined(slug.current)
    && $sauceIds != null
    && count($sauceIds) > 0
    && references(*[_id in $sauceIds]._id)
  ] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    tags,
    meat,
    versions,
    "categories": array::compact(categories[]->{ _id, title, slug }),
    "descriptionPlain": "",
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right }
    },
    "sauceLines": array::unique((array::compact(dgfSauces[]->line) + array::compact(lfdSauces[]->line)))
  }
`);

export const getRecipeByIdQuery = defineQuery(`
  *[
    _type == "recipe"
    && _id == $id
  ][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    serves,
    tags,
    meat,
    versions,
    "categories": array::compact(categories[]->{ _id, title, slug }),
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right },
      "alt": mainImage.alt
    },
    "video": ${recipeVideoFragment},
    dgfIngredients,
    dgfDirections,
    dgfNotes,
    lfdIngredients,
    lfdDirections,
    lfdNotes,
    dgfSauces[]->{
      _id,
      name,
      "slug": slug.current,
      line,
      "mainImage": mainImage{
        ${imageFields},
        "alt": coalesce(alt, "")
      }
    },
    lfdSauces[]->{
      _id,
      name,
      "slug": slug.current,
      line,
      "mainImage": mainImage{
        ${imageFields},
        "alt": coalesce(alt, "")
      }
    }
  }
`);

export const getRecipeBySlugQuery = defineQuery(`
  *[
    _type == "recipe"
    && slug.current in [$slug, $prefixedSlug]
  ][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    serves,
    tags,
    meat,
    versions,
    "categories": array::compact(categories[]->{ _id, title, slug }),
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right },
      "alt": mainImage.alt
    },
    "video": ${recipeVideoFragment},
    dgfIngredients,
    dgfDirections,
    dgfNotes,
    lfdIngredients,
    lfdDirections,
    lfdNotes,
    dgfSauces[]->{
      _id,
      name,
      "slug": slug.current,
      line,
      "mainImage": mainImage{
        ${imageFields},
        "alt": coalesce(alt, "")
      }
    },
    lfdSauces[]->{
      _id,
      name,
      "slug": slug.current,
      line,
      "mainImage": mainImage{
        ${imageFields},
        "alt": coalesce(alt, "")
      }
    }
  }
`);

export const getAllProductsForIndexQuery = defineQuery(`
  *[_type == "product"] | order(name asc){
    _id,
    _type,
    name,
    "slug": slug.current,
    sku,
    category,
    price,
    "descriptionPlain": coalesce(pt::text(description), ""),
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right },
      "alt": mainImage.alt
    },
    "sauceLines": array::unique((sauces[]->line)[defined(@)]),
    "sauceTypes": array::unique((sauces[]->category)[defined(@)])
  }
`);

export const getProductsBySauceIdQuery = defineQuery(`
  *[
    _type == "product"
    && defined(slug.current)
    && references($sauceId)
  ] | order(name asc){
    _id,
    _type,
    name,
    "slug": slug.current,
    sku,
    category,
    price,
    "descriptionPlain": coalesce(pt::text(description), ""),
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right },
      "alt": mainImage.alt
    },
    "sauceLines": array::unique((sauces[]->line)[defined(@)]),
    "sauceTypes": array::unique((sauces[]->category)[defined(@)])
  }
`);

export const getProductBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current in [$slug, $prefixedSlug]][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    sku,
    category,
    shippingCategory,
    price,
    weight,
    "description": description[]{
      ...,
      _type == "block" => {
        ...,
        ${markDefsFragment}
      },
      _type == "image" => {
        ${imageFields},
        "caption": caption
      }
    },
    "descriptionPlain": coalesce(pt::text(description), ""),
    "mainImage": mainImage{
      ${imageFields},
      "alt": coalesce(alt, "")
    },
    "sauces": array::compact(sauces[]->{
      _id,
      _type,
      name,
      line,
      category,
      "slug": slug.current,
      "descriptionPlain": coalesce(pt::text(description), ""),
      "mainImage": mainImage{
        ${imageFields},
        "alt": coalesce(alt, "")
      }
    })
  }
`);
