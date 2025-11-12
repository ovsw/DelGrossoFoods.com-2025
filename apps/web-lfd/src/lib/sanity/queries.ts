import {
  buttonsFragment,
  imageFields,
  imageFragment,
  markDefsFragment,
  pageBuilderFragment,
} from "@workspace/sanity-config/fragments";
import { defineQuery } from "next-sanity";

export const lfdHomePageQuery = defineQuery(`
  *[_type == "homePage" && site._ref == $siteId][0]{
    _id,
    _type,
    title,
    description,
    seoTitle,
    seoDescription,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
`);

export const lfdSlugPageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && site._ref == $siteId][0]{
    _id,
    _type,
    title,
    description,
    seoTitle,
    seoDescription,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
`);

export const lfdSlugPagePathsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current) && site._ref == $siteId].slug.current
`);

export const lfdFooterQuery = defineQuery(`
  *[_type == "footer" && site._ref == $siteId][0]{
    _id,
    _type,
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

export const lfdNavbarQuery = defineQuery(`
  *[_type == "navbar" && site._ref == $siteId][0]{
    _id,
    _type,
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

export const lfdGlobalSeoSettingsQuery = defineQuery(`
  *[_type == "settings" && site._ref == $siteId][0]{
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

export const lfdSettingsQuery = defineQuery(`
  *[_type == "settings" && site._ref == $siteId][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`);

export const lfdSitemapQuery = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current) && site._ref == $siteId]{
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

export const lfdSauceIndexPageQuery = defineQuery(`
  *[_type == "sauceIndex" && site._ref == $siteId][0]{
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

export const lfdRecipeIndexPageQuery = defineQuery(`
  *[_type == "recipeIndex" && site._ref == $siteId][0]{
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

export const lfdRecipeCategoriesQuery = defineQuery(`
  *[_type == "recipeCategory" && site._ref == $siteId] | order(title asc){
    _id,
    title,
    slug
  }
`);

export const lfdProductIndexPageQuery = defineQuery(`
  *[_type == "productIndex" && site._ref == $siteId][0]{
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

export const lfdHistoryPageQuery = defineQuery(`
  *[_type == "historyPage" && site._ref == $siteId][0]{
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
        _key,
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

export const lfdStoreLocatorPageQuery = defineQuery(`
  *[_type == "storeLocator" && site._ref == $siteId][0]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
`);

export const lfdContactPageQuery = defineQuery(`
  *[_type == "contactPage" && site._ref == $siteId][0]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    "siteSettings": *[_type == "settings" && site._ref == $siteId][0]{
      _id,
      addressLines,
      contactEmail,
      tollFreePhone,
      officePhone,
      corporateWebsiteUrl
    },
    ${pageBuilderFragment}
  }
`);
