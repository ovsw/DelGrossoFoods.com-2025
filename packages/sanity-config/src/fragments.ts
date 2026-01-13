// Shared GROQ fragments used across DelGrosso sites.
export const imageFields = /* groq */ `
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

export const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

export const recipeVideoFragment = /* groq */ `
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

export const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

export const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

export const richTextFragment = /* groq */ `
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

export const subTitleRichTextFragment = /* groq */ `
  subTitle[]{
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

export const helperTextRichTextFragment = /* groq */ `
  helperText[]{
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

export const introRichTextFragment = /* groq */ `
  intro[]{
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

export const bodyRichTextFragment = /* groq */ `
  body[]{
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

export const descriptionRichTextFragment = /* groq */ `
  description[]{
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

export const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

export const blogCardFragment = /* groq */ `
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

export const buttonsFragment = /* groq */ `
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

export const sectionSpacingFragment = /* groq */ `
  "spacing": {
    "spacingTop": coalesce(spacing.spacingTop, "default"),
    "spacingBottom": coalesce(spacing.spacingBottom, "default")
  }
`;

export const ctaBlock = /* groq */ `
  _type == "cta" => {
    eyebrow,
    title,
    surfaceColor,
    applySurfaceShine,
    ${richTextFragment},
    ${buttonsFragment}
  }
`;

export const imageLinkCardsBlock = /* groq */ `
  _type == "imageLinkCards" => {
    eyebrow,
    title,
    ${richTextFragment},
    ${buttonsFragment},
    "cards": array::compact(cards[]{
      _key,
      _type,
      title,
      description,
      ${imageFragment},
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      ),
      "openInNewTab": url.openInNewTab
    })
  }
`;

export const featureBlock = /* groq */ `
  _type == "feature" => {
    badge,
    title,
    imageFit,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

export const featuredRecipesBlock = /* groq */ `
  _type == "featuredRecipes" => {
    eyebrow,
    title,
    intro,
    "recipes": array::compact(recipes[]->{
      _id,
      name,
      "slug": slug.current,
      versions,
      meat,
      tags,
      "dgfSauces": array::compact(dgfSauces[]->{
        _id,
        name,
        "mainImage": select(
          defined(mainImage.asset._ref) => {
            "id": mainImage.asset._ref,
            "preview": mainImage.asset->metadata.lqip,
            "hotspot": mainImage.hotspot{
              x,
              y
            },
            "crop": mainImage.crop{
              bottom,
              left,
              right,
              top
            },
            "alt": mainImage.alt
          }
        )
      }),
      "lfdSauces": array::compact(lfdSauces[]->{
        _id,
        name,
        "mainImage": select(
          defined(mainImage.asset._ref) => {
            "id": mainImage.asset._ref,
            "preview": mainImage.asset->metadata.lqip,
            "hotspot": mainImage.hotspot{
              x,
              y
            },
            "crop": mainImage.crop{
              bottom,
              left,
              right,
              top
            },
            "alt": mainImage.alt
          }
        )
      }),
      "mainImage": select(
        defined(mainImage.asset._ref) => {
          "id": mainImage.asset._ref,
          "preview": mainImage.asset->metadata.lqip,
          "hotspot": mainImage.hotspot{
            x,
            y
          },
          "crop": mainImage.crop{
            bottom,
            left,
            right,
            top
          },
          "alt": mainImage.alt
        }
      )
    })
  }
`;

export const faqFragment = /* groq */ `
  "faqs": array::compact(faqs[]->{
    _id,
    title,
    ${richTextFragment}
  })
`;

export const faqAccordionBlock = /* groq */ `
  _type == "faqAccordion" => {
    eyebrow,
    title,
    subtitle,
    ${faqFragment},
    "link": link{
      title,
      description,
      "url": {
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    }
  }
`;

export const featureCardsIconBlock = /* groq */ `
  _type == "featureCardsIcon" => {
    eyebrow,
    title,
    ${richTextFragment},
    "cards": cards[]{
      _key,
      icon,
      title,
      ${richTextFragment}
    }
  }
`;

export const subscribeNewsletterBlock = /* groq */ `
  _type == "subscribeNewsletter" => {
    title,
    ${subTitleRichTextFragment},
    ${helperTextRichTextFragment}
  }
`;

export const threeProductPanelsBlock = /* groq */ `
  _type == "threeProductPanels" => {
    eyebrow,
    title,
    subtitle,
    "panels": array::compact(panels[]{
      _key,
      title,
      shortDescription,
      expandedDescription,
      accentColor,
      ${imageFragment},
      "ctaButton": ctaButton{
        text,
        variant,
        _key,
        _type,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    })
  }
`;

export const longFormBlock = /* groq */ `
  _type == "longForm" => {
    eyebrow,
    title,
    ${introRichTextFragment},
    ${bodyRichTextFragment}
  }
`;

export const homeSlideshowBlock = /* groq */ `
  _type == "homeSlideshow" => {
    "slides": array::compact(slides[]{
      _key,
      title,
      subtitle,
      ${descriptionRichTextFragment},
      ${imageFragment},
      ${buttonsFragment}
    })
  }
`;

export const homeSlideshowVerticalBlock = /* groq */ `
  _type == "homeSlideshowVertical" => {
    title,
    headingRichText[]{
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
    ${descriptionRichTextFragment},
    ${buttonsFragment},
    "leftColumnImages": array::compact(leftColumnImages[]{
      _key,
      ${imageFields}
    }),
    "rightColumnImages": array::compact(rightColumnImages[]{
      _key,
      ${imageFields}
    })
  }
`;

export const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    _key,
    _type,
    ${sectionSpacingFragment},
    ${ctaBlock},
    ${featureBlock},
    ${featuredRecipesBlock},
    ${faqAccordionBlock},
    ${featureCardsIconBlock},
    ${subscribeNewsletterBlock},
    ${imageLinkCardsBlock},
    ${threeProductPanelsBlock},
    ${longFormBlock},
    ${homeSlideshowBlock},
    ${homeSlideshowVerticalBlock}
  }
`;

export const ogFieldsFragment = /* groq */ `
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
