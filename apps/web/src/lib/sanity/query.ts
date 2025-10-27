import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  },
  "alt": alt
`;
// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

const recipeVideoFragment = /* groq */ `
  select(
    defined(video.asset.asset._ref) => {
      "playbackId": video.asset.asset->playbackId,
      "assetId": video.asset.asset->assetId,
      "status": video.asset.asset->status,
      "thumbTime": video.asset.asset->thumbTime,
      "policy": coalesce(video.asset.asset->data.playback_ids[0].policy, "public"),
      "posterImage": video.posterImage{
        ${imageFields}
      }
    }
  )
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
    _type == "image" => {
      ${imageFields},
      "caption": caption
    }
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

const sectionSpacingFragment = /* groq */ `
  "spacing": {
    "spacingTop": coalesce(spacing.spacingTop, "default"),
    "spacingBottom": coalesce(spacing.spacingBottom, "default")
  }
`;

// Page builder block fragments
const ctaBlock = /* groq */ `
  _type == "cta" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
  }
`;
const imageLinkCardsBlock = /* groq */ `
  _type == "imageLinkCards" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
    "cards": array::compact(cards[]{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      ),
      ${imageFragment},
    })
  }
`;

const featureBlock = /* groq */ `
  _type == "feature" => {
    ...,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const homeSlideshowBlock = /* groq */ `
  _type == "homeSlideshow" => {
    ...,
    "slides": array::compact(slides[0...2]{
      _key,
      title,
      subtitle,
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
      ${buttonsFragment},
      "image": select(
        defined(image.asset._ref) => {
          "image": image{
            ${imageFields}
          },
          "alt": image.alt
        }
      )
    })
  }
`;

const faqFragment = /* groq */ `
  "faqs": array::compact(faqs[]->{
    title,
    _id,
    _type,
    ${richTextFragment}
  })
`;

const faqAccordionBlock = /* groq */ `
  _type == "faqAccordion" => {
    ...,
    ${faqFragment},
    link{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const subscribeNewsletterBlock = /* groq */ `
  _type == "subscribeNewsletter" => {
    ...,
    "subTitle": subTitle[]{
      ...,
      ${markDefsFragment}
    },
    "helperText": helperText[]{
      ...,
      ${markDefsFragment}
    }
  }
`;

const featureCardsIconBlock = /* groq */ `
  _type == "featureCardsIcon" => {
    ...,
    ${richTextFragment},
    "cards": array::compact(cards[]{
      ...,
      ${richTextFragment},
    })
  }
`;

const threeProductPanelsBlock = /* groq */ `
  _type == "threeProductPanels" => {
    ...,
    "panels": array::compact(panels[]{
      ...,
      ${imageFragment},
      "ctaButton": select(
        defined(ctaButton.text) && defined(ctaButton.url) => {
          "_type": "button",
          "_key": coalesce(ctaButton._key, ^._key + "-cta"),
          "text": ctaButton.text,
          "openInNewTab": ctaButton.url.openInNewTab,
          "href": select(
            ctaButton.url.type == "internal" && defined(ctaButton.url.internal->slug.current) => ctaButton.url.internal->slug.current,
            ctaButton.url.type == "external" && defined(ctaButton.url.external) => ctaButton.url.external,
            ctaButton.url.href
          )
        }
      )
    })
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    ${sectionSpacingFragment},
    _type,
    ${ctaBlock},
    ${featureBlock},
    ${faqAccordionBlock},
    ${featureCardsIconBlock},
    ${subscribeNewsletterBlock},
    ${imageLinkCardsBlock},
    ${threeProductPanelsBlock},
    ${homeSlideshowBlock}
  }
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment}
  }`);

export const querySlugPageData = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current,
    "blogs": *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc){
      ${blogCardFragment}
    }
  }
`);

export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": coalesce(string(select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    _type == "sauce" => name,
    _type == "product" => name,
    _type == "recipe" => name,
    title
  )), ""),
  "description": coalesce(string(select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    _type == "sauce" => pt::text(description),
    _type == "product" => coalesce(pt::text(description), name),
    _type == "recipe" => coalesce(pt::text(description), name),
    description
  )), ""),
  // Prefer mainImage (product/recipe) and fall back to image
  "image": coalesce(
    mainImage.asset->url,
    image.asset->url
  ) + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": coalesce(
    mainImage.asset->metadata.palette.dominant.background,
    image.asset->metadata.palette.dominant.background
  ),
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max",
  "date": coalesce(date, _createdAt)
`;

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

export const queryBlogPageOGData = defineQuery(`
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    subtitle,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        ),
      }
    }
  }
`);

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`);

export const querySitemapData = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "saucePages": *[_type == "sauce" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "productPages": *[_type == "product" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "recipePages": *[_type == "recipe" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);
export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    addressLines,
    contactEmail,
    tollFreePhone,
    officePhone,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`);

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`);

// Sauces index queries
export const getSauceIndexPageQuery = defineQuery(`
  *[_type == "sauceIndex"][0]{
    _id,
    _type,
    title,
    description,
    "pageHeaderImage": select(
      defined(pageHeaderImage.asset._ref) => {
        "id": pageHeaderImage.asset._ref,
        "preview": pageHeaderImage.asset->metadata.lqip,
        "hotspot": pageHeaderImage.hotspot{ x, y },
        "crop": pageHeaderImage.crop{ bottom, left, right, top },
        "alt": pageHeaderImage.alt
      }
    ),
    "slug": slug.current
  }
`);

export const getAllSaucesForIndexQuery = defineQuery(`
  *[_type == "sauce" && !(_id in path('drafts.**'))] | order(name asc){
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
    && !(_id in path('drafts.**'))
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

// Recipes index queries
export const getRecipeIndexPageQuery = defineQuery(`
  *[_type == "recipeIndex"][0]{
    _id,
    _type,
    title,
    description,
    "pageHeaderImage": select(
      defined(pageHeaderImage.asset._ref) => {
        "id": pageHeaderImage.asset._ref,
        "preview": pageHeaderImage.asset->metadata.lqip,
        "hotspot": pageHeaderImage.hotspot{ x, y },
        "crop": pageHeaderImage.crop{ bottom, left, right, top },
        "alt": pageHeaderImage.alt
      }
    ),
    "slug": slug.current
  }
`);

export const getAllRecipesForIndexQuery = defineQuery(`
  *[_type == "recipe" && !(_id in path('drafts.**'))] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    tags,
    meat,
    versions,
    // Lightweight boolean for filter: whether a video asset exists
    "hasVideo": defined(video.asset.asset._ref),
    "categories": array::compact(categories[]->{ _id, title, slug }),
    "descriptionPlain": "",
    "mainImage": {
      "id": coalesce(mainImage.asset._ref, ""),
      "preview": mainImage.asset->metadata.lqip,
      "hotspot": mainImage.hotspot{ x, y },
      "crop": mainImage.crop{ top, bottom, left, right }
    },
    // Compute unique product lines from both DGF and LFD sauces
    "sauceLines": array::unique((array::compact(dgfSauces[]->line) + array::compact(lfdSauces[]->line)))
  }
`);

export const getRecipesBySauceIdQuery = defineQuery(`
  *[
    _type == "recipe"
    && defined(slug.current)
    && !(_id in path('drafts.**'))
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
    // Compute unique product lines from both DGF and LFD sauces
    "sauceLines": array::unique((array::compact(dgfSauces[]->line) + array::compact(lfdSauces[]->line)))
  }
`);

export const getRecipesBySauceIdsQuery = defineQuery(`
  *[
    _type == "recipe"
    && defined(slug.current)
    && !(_id in path('drafts.**'))
    && $sauceIds != null
    && count($sauceIds) > 0
    && count((coalesce(dgfSauces[]._ref, []) + coalesce(lfdSauces[]._ref, []))[@ in $sauceIds]) > 0
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
    // Compute unique product lines from both DGF and LFD sauces
    "sauceLines": array::unique((array::compact(dgfSauces[]->line) + array::compact(lfdSauces[]->line)))
  }
`);

export const getAllRecipeCategoriesQuery = defineQuery(`
  *[_type == "recipeCategory"] | order(title asc){ _id, title, slug }
`);

export const getRecipeByIdQuery = defineQuery(`
  *[
    _type == "recipe"
    && _id == $id
    && !(_id in path('drafts.**'))
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
    && !(_id in path('drafts.**'))
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

// Products index queries
export const getProductIndexPageQuery = defineQuery(`
  *[_type == "productIndex"][0]{
    _id,
    _type,
    title,
    description,
    "pageHeaderImage": select(
      defined(pageHeaderImage.asset._ref) => {
        "id": pageHeaderImage.asset._ref,
        "preview": pageHeaderImage.asset->metadata.lqip,
        "hotspot": pageHeaderImage.hotspot{ x, y },
        "crop": pageHeaderImage.crop{ bottom, left, right, top },
        "alt": pageHeaderImage.alt
      }
    ),
    "slug": slug.current
  }
`);

export const getAllProductsForIndexQuery = defineQuery(`
  *[_type == "product" && defined(slug.current) && !(_id in path('drafts.**'))] | order(name asc){
    _id,
    name,
    "slug": slug.current,
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
    // Unique sets of referenced sauce attributes for filtering/badges
    "sauceLines": array::unique((sauces[]->line)[defined(@)]),
    "sauceTypes": array::unique((sauces[]->category)[defined(@)])
  }
`);

export const getProductsBySauceIdQuery = defineQuery(`
  *[
    _type == "product"
    && defined(slug.current)
    && !(_id in path('drafts.**'))
    && $sauceId != null
    && references($sauceId)
  ] | order(name asc){
    _id,
    name,
    "slug": slug.current,
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

export const getHistoryPageQuery = defineQuery(`
  *[_type == "historyPage"][0]{
    _id,
    _type,
    title,
    description,
    "pageHeaderImage": select(
      defined(pageHeaderImage.asset._ref) => {
        "id": pageHeaderImage.asset._ref,
        "preview": pageHeaderImage.asset->metadata.lqip,
        "hotspot": pageHeaderImage.hotspot{ x, y },
        "crop": pageHeaderImage.crop{ bottom, left, right, top },
        "alt": pageHeaderImage.alt
      }
    ),
    "slug": slug.current,
    timeline{
      markers[]{
        heading,
        subtitle,
        content[]{
          ...,
          _type == "block" => {
            ...,
            ${markDefsFragment}
          },
          _type == "image" => {
            ${imageFragment}
          }
        },
        image{
          ${imageFields},
          "assetRef": asset._ref
        }
      }
    },
    ${pageBuilderFragment}
  }
`);

export const getStoreLocatorPageQuery = defineQuery(`
  *[_type == "storeLocator"][0]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
`);

export const getContactPageQuery = defineQuery(`
  *[_type == "contactPage"][0]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
`);
