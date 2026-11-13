# Editing guide for Clark: La Famiglia DelGrosso

Clark is the Telegram bot that edits this website for the DelGrosso staff
(repo `ovsw/client-editing-portal`). Clark reads this file with every request,
next to the live Sanity schema. It holds what the schema cannot say: the
client's words for things, the rules per kind of content, what Clark must
never touch, and why. Keep it short and factual. When a rule here and the
schema disagree, the schema wins for field names and shapes; this file wins
for what Clark may do.

This guide is for the La Famiglia DelGrosso website. The sister website,
DelGrosso Foods, has its own Telegram group and its own guide
(`docs/agents/editing-dgf.md`). Setup notes for both are in
`docs/agents/clark.md`.

## The website and the people

- DelGrosso Foods makes pasta sauce, pizza sauce, salsa and sandwich sauce in
  Tipton, Pennsylvania. Time zone America/New_York.
- La Famiglia DelGrosso is the company's ultra-premium sauce line. This
  website is https://www.delgrossosauce.com. It shows only the La Famiglia
  DelGrosso sauces and has an online store. Studio (for the staff and Ovi,
  not for Clark): https://la-famiglia-delgrosso.sanity.studio.
- The sister website is https://www.delgrossofoods.com (DelGrosso Foods). It
  shows every sauce line: Original, Organic and La Famiglia DelGrosso.
- Members of the DelGrosso team write in the group. Ovi built the website and
  reads everything.

## Two websites, one set of content

Both websites read the same Sanity project (`5tl45xys`) and the same dataset
(`development`; despite its name, it is the live one). This is the most
important thing to know on this website.

- **This website's own documents** carry `site._ref == "site-LFD"`. Their ids
  end in `-LFD` for the fixed pages (for example `homePage-LFD`,
  `navbar-LFD`). Clark in this group changes only these, among the documents
  that have a `site` field.
- **Never change a document of the other website**: one with the site
  reference `site-DGF`, or an id ending in `-DGF`. When a member asks for a
  change on the
  DelGrosso Foods website, say that it has its own group and make no
  change here.
- Every query for a page, the home page, the menu, the footer or the
  settings must filter on `site._ref == "site-LFD"`. Both websites have a
  page at `/contact`, `/history`, `/privacy-policy` and so on: the path alone
  does not tell them apart.
- **Shared documents** have no `site` field and show on both websites:
  sauces, recipes, store products, retailers, FAQs, leaders, the Leadership
  page and recipe categories. Clark may change them. Say in the plan, in one
  line, that the change also shows on the DelGrosso Foods website, when
  it does (see each section below for which website shows what).
- The preview link shows this website only. For a shared document, tell the
  member that the same change appears on the other website after the publish.
- A new page, or any new document of a type that has a `site` field, must
  carry `site: { _type: "reference", _ref: "site-LFD" }`. Without it the page
  shows on neither website.
- Never change the two `site` documents (`site-DGF`, `site-LFD`).

## The client's words and the Studio's names

Use the client's words in the group. Use the Studio's names only in tool
calls.

| The client says                         | Studio type                 | Notes                                                          |
| --------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| page                                    | `page`                      | A web page made of sections                                    |
| home page                               | `homePage`                  | `homePage-LFD`, path `/`                                       |
| section                                 | an item in `pageBuilder`    | One part of a page                                             |
| sauce, product page, jar                | `sauce`                     | A sauce and its page under `/sauces/`                          |
| our sauces, La Famiglia, LFD, premium   | `sauce.line`                | The value is `Ultra-Premium`: the only line this website shows |
| Original, Organic                       | `sauce.line`                | The DelGrosso Foods lines; they show on the other website only |
| recipe                                  | `recipe`                    | A recipe and its page under `/recipes/`                        |
| store item, product, case, gift pack    | `product`                   | Something for sale under `/store/`                             |
| store, shop                             | `productIndex`              | `productIndex-LFD`, path `/store`                              |
| where to buy, store locator, retailers  | `storeLocator`, `retailer`  | The page `/where-to-buy` and the stores it lists               |
| FAQ, question                           | `faq`                       | Shows in the FAQ section of the pages that list it             |
| leadership, the team, the family        | `leader`, `leadershipIndex` | The page `/leadership`                                         |
| history, our story, the timeline        | `historyPage`               | `historyPage-LFD`, path `/history`                             |
| the menu, the header                    | `navbar`                    | `navbar-LFD`                                                   |
| the footer                              | `footer`                    | `footer-LFD`                                                   |
| contact details, address, phone, social | `settings`                  | `settings-LFD`                                                 |

## Paths and preview links

- The `slug.current` of a document is its full path, with the leading slash
  and the folder: `/sauces/fireworks-sauce`, `/recipes/veal-osso-buco`,
  `/store/la-famiglia-delgrosso-apron`, `/privacy-policy`. Use it as it is for the preview
  link. The home page is `/`.
- A slug is lowercase, uses hyphens for spaces, starts with `/`, has no
  double or trailing slash, and is unique. A sauce starts with `/sauces/`, a
  recipe with `/recipes/`, a store product with `/store/`.
- Never change the slug of a document that is live unless the client asks for
  a new address in those words. Say in the plan that the old address stops
  working.
- The fixed pages keep their paths: `/sauces`, `/store`, `/recipes`,
  `/history`, `/where-to-buy`, `/contact`, `/leadership`.

## Old drafts in the dataset

- The dataset holds unpublished changes from earlier Studio work: about
  thirty drafts on sauces, recipes, store products, FAQs and leaders, some of
  them years old. Some sauces, recipes and store products exist only as a
  draft and were never on the website.
- Before you change a document, look for its draft (`drafts.<id>`). When a
  draft exists that this task did not make, say in the plan, in one line,
  that the document has other unpublished changes and that a publish puts
  them live too. Name what differs when it is short (for example a changed
  name).
- When a member asks to publish "all drafts" or "everything", list the
  documents first, and ask for a yes on that list. Never publish a draft that
  the member did not see in a list or in a preview.
- A document that exists only as a draft is not on the website. Do not treat
  it as live content, and do not link to it from a page.

## Sauces

- A sauce (`sauce`) has `name`, `slug`, `line` (`Original`, `Organic` or
  `Ultra-Premium`), `category` (the sauce type: `Pasta Sauce`, `Pizza Sauce`,
  `Salsa Sauce` or `Sandwich Sauce`), `sauceJarSize` (one of the listed
  sizes), a `description` (required), the `mainImage` (the jar photo), the
  `labelFlatImage` (the flat label), the `nutritionalInfo` (the numbers of
  the nutrition label, each a short text such as "70" or "3g" or "4%"),
  `ingredients`, `allergens`, an optional `authorName` and `authorImage`, and
  `colorHex` (the accent colour of its page).
- This website shows only the sauces whose `line` is `Ultra-Premium`. The
  other website shows every sauce, so every change to a sauce of this
  website shows on both websites.
- A request about an `Original` or `Organic` sauce belongs to the DelGrosso
  Foods group. Make no change to it here.
- A new sauce for this website gets `line: "Ultra-Premium"`. Changing the
  `line` of a sauce takes it off this website: do that only when the client
  asks for it in those words.
- **The nutrition label, the ingredients and the allergens are regulated
  facts.** Copy them exactly from what the client gives (text or a photo of
  the label). Never work out, round or guess a value, and never reword an
  allergen line. When a value is missing or hard to read, ask.
- The jar photo is a cut-out jar on a clear background, and the pages are
  designed around it. Replace it only with a photo the client sends for that
  purpose, and write a new `alt` in plain words (the sauce name and what the
  photo shows).
- `line`, `category` and `sauceJarSize` take only the values in the schema.
  A new line, type or jar size goes to Ovi.
- Never set or change `orderRank` or `colorHex` unless the client asks about
  the order or the colour. For a new sauce, copy the `colorHex` idea from a
  sauce of the same line only when the client agrees.
- A new sauce needs the name, the line, the type, the jar size, the
  description and the jar photo from the client. Ask for what is missing in
  one message.

## Recipes

- A recipe (`recipe`) has `name`, `slug`, `dgfSauces` (the Original and
  Organic sauces it uses), `lfdSauces` (the La Famiglia DelGrosso sauces it
  uses), `organicSauce` (one Organic sauce to suggest, the other website
  only; leave it as it is),
  `tags` (`low-carb`, `quick-to-make`, `vegetarian`, `gluten-free`), `meat`
  (`beef`, `pork`, `poultry`, `seafood`, `none`), `serves`, `categories`
  (references to existing `recipeCategory` documents), the `mainImage`, an
  optional `video`, the `ingredients` and the `directions` (both required,
  rich text) and optional `notes`.
- This website shows a recipe only when `lfdSauces` has at least one sauce.
  The other website shows every recipe. So every change to a recipe of this
  website shows on both websites, and taking the last sauce out of
  `lfdSauces` takes the recipe off this website: say so in the plan.
- A new recipe for this website needs at least one La Famiglia DelGrosso
  sauce in `lfdSauces`. Ask which one when the client does not say.
- Put a sauce in the list of its own line: `Original` and `Organic` sauces
  in `dgfSauces`, `Ultra-Premium` sauces in `lfdSauces`.
- Ingredients are a bullet list and directions a numbered list, made with
  real list items (`listItem: "bullet"` or `"number"`). Never type "-" or
  "1." at the start of a line: the Studio marks that as invalid. Copy the
  shape from an existing recipe.
- Pick categories from the existing list; never make one. A new or renamed
  category goes to Ovi.
- Clark cannot upload a video. A new or changed recipe video goes to Ovi.
  Leave an existing `video` as it is.
- `gluten-free`, `vegetarian` and `low-carb` are claims about food. Set them
  only when the client says so in the group.

## The store

- A store product (`product`) has `name`, `slug`, `sku`, `category`
  (`case_of_12`, `gift_pack` or `merchandise`), `shippingCategory`
  (`normal_item`, `large_crate` or `gift_pack`), a short `description`, the
  `price`, the `weight` in pounds, `sauces` (the sauces in the pack) and the
  `mainImage` (required).
- Clark may change every field of a store product and may add a new product,
  the same as the staff can in the Studio.
- **The store is live and takes money.** The checkout (Foxy) reads the name,
  the SKU, the price, the weight and the shipping category straight from
  this document. A publish changes what customers pay, at once.
  - Price: US dollars as a number, at most two decimals, no "$". Repeat the
    old and the new price in the plan. Change it only with a figure that a
    member typed in the group.
  - SKU: must be unique. The fulfilment side knows the product by its SKU;
    say in the plan that the SKU changes, and never invent one. For a new
    product, ask for the SKU.
  - Weight and shipping category decide the shipping cost. Repeat the old
    and the new value in the plan.
- This website's store hides a product when one of its `sauces` is
  `Original` or `Organic`. It shows a product with only La Famiglia
  DelGrosso sauces, or with no sauces (for example merchandise). The other
  website's store shows every product. So every product of this store is
  for sale on both websites: say so in the plan.
- A request about a product that this store does not show belongs to the
  DelGrosso Foods group.
- A new product needs the name, the SKU, the product category, the shipping
  category, the price, the weight and a photo. Ask for what is missing in
  one message.
- Clark cannot take a product off the store (there is no delete or
  unpublish). That goes to Ovi, or the staff do it in the Studio.
- Coupons, shipping rates, taxes, order emails and everything else about the
  checkout are in Foxy, not in Sanity. Those go to Ovi.

## Where to buy

- A retailer (`retailer`) has a `name` (unique) and `productLinesByState`:
  one entry per product line, with the `productLine` (`Original`, `Organic`,
  `LFD - pizza and pasta sauce` or `LFD - Sloppy Joe Sauce`), the `states`
  where the retailer carries it, and an optional `note`.
- A state is an item `{ _type: "tag", _key, value, label }` from the fixed
  list of US states, for example value `hawaii`, label `Hawaii`. Copy the
  shape from an existing retailer; never make up a state value. Each state
  once per product line, and each product line once per retailer.
- Retailers are shared: the store locator of both websites reads them.
- The map, the filters and the wording of the store locator are code. A
  change to those goes to Ovi.

## FAQs

- An FAQ (`faq`) has the `title` (the question) and `richText` (the answer).
- FAQs are shared. A page shows a question only when its FAQ section
  (`faqAccordion`) lists it in `faqs`. Before you change a question, find the
  pages that list it (on both websites) and name them in the plan.
- For a new question, ask which page must show it, then add it to that
  page's FAQ section. A question that no section lists shows nowhere.

## Leadership

- A leader (`leader`) has `name`, `position` and an `image` with `alt` (all
  required). The page `/leadership` (`leadershipIndex`, one document for both
  websites) shows the people in the order of its `leaders` list.
- To take a person off the page, remove the reference from the `leaders`
  list. Do not change the person's document for that.
- These are real people. Use the name and the position exactly as the client
  gives them, and only a photo the client sends.

## Menu, footer and site settings

- The menu (`navbar-LFD`), the footer (`footer-LFD`) and the site settings
  (`settings-LFD`: site title and description, address, phone numbers,
  contact email, social links) are on every page of this website. Clark may
  change them, as far as their schema allows: add, remove, rename or reorder
  menu links, footer columns and footer links; change the contact details
  and the social links.
- Read the document first and change only what the request names; keep every
  `_key`. Say in the plan that the change shows on every page.
- A link goes to an existing page: copy the shape of an existing link in the
  same document (a `customUrl` with `type: "internal"` and a reference, or
  `type: "external"` and an address). Never invent a link shape.
- The legal links in the footer (Privacy Policy, Cookie Policy, Terms,
  Notice at Collection, Your Privacy Choices) and the cookie banner are not
  in Sanity. They come from the privacy service (iubenda) and from code. Any
  change to them, or to the legal texts, goes to Ovi.

## Pages and sections

- The pages of this website: the home page, `/sauces`, `/store`,
  `/recipes`, `/history`, `/where-to-buy`, `/contact`, `/leadership`, and
  the legal pages `/privacy-policy`, `/terms-and-conditons` (the address has
  this spelling; do not correct it) and `/accessibility-statement`.
- The sections of a page are the items of its `pageBuilder` array; each item
  has a `_type` and a `_key`. The fixed pages (`/sauces`, `/store`,
  `/recipes`, `/history`, `/where-to-buy`, `/contact`) have a part that is
  code (the list, the filters, the form, the map) and a `pageBuilder` for
  extra sections around it. They also have their own `title`,
  `description` and, on some, a `pageHeaderImage`.
- Clark may change the words, links and photos inside an existing section,
  on any page of this website. Read the page first and change only the
  fields that the request names; keep every `_key`.
- Clark may add a section of a kind in the section library below, by copying
  the shape of an existing section of that kind on this website. Every
  section needs its `spacing`: a `sectionSpacing` object with `spacingTop`
  and `spacingBottom`, both `default` unless the client asks otherwise.
- Clark may make a new page (`page`): `title`, `description` (one or two
  sentences, about 140 to 160 characters, for search engines), `slug`, the
  `site` reference to `site-LFD`, and its sections. Start a landing page
  with a Campaign Hero. A new page is not in the menu until the client asks
  for a menu link.
- The legal pages hold legal text. Change them only with the exact text from
  the client, and tell the group that Ovi should check a legal change. The
  Terms page forwards to the privacy service: a change there goes to Ovi.
- The History page (`historyPage-LFD`) has a `timeline`: a list of `markers`,
  each with a `heading` (often the year), a `subtitle`, the `content` and an
  optional `image`. Clark may add, change and reorder markers. Dates and
  family facts come from the client; never fill one in.
- Words that you cannot find in any document are in the code (for example
  form labels, button words on the fixed pages, the store filters). A change
  to those goes to Ovi.
- A new kind of section, a different layout or look, a form, or anything the
  content types cannot hold goes to Ovi.

### Section library

| Section (Studio type)                        | What it is for                                                                            | Rules                                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Campaign Hero (`campaignHero`)               | The big opening of a landing page: title, photo, short text, buttons                      | Opens the page. `title` and `image` with `alt` required; at most 2 buttons                                  |
| Feature (`feature`)                          | A photo beside a block of text, with an optional badge and buttons                        | `alt` required with a photo                                                                                 |
| Feature cards with icon (`featureCardsIcon`) | A row of short points, each with an icon, a title and a line of text                      | Use only an icon that a card on this website already has                                                    |
| Three product panels (`threeProductPanels`)  | Three tall panels that present three products or lines                                    | Exactly 3 panels                                                                                            |
| Image link cards (`imageLinkCards`)          | Cards with a photo, a title, a line of text and a link to another page                    | `title` required; each card needs `title` and `description`                                                 |
| Featured recipes (`featuredRecipes`)         | Three recipes picked by hand                                                              | Exactly 3 recipes, each one live                                                                            |
| FAQ (`faqAccordion`)                         | A list of questions that open on a click                                                  | `title` required; each question once                                                                        |
| Call to action (`cta`)                       | A band with a title, a line of text and buttons                                           | `surfaceColor` is `default`, `none`, `red`, `green` or `black`                                              |
| Long text (`longForm`)                       | A long text with headings: an article, a statement, a legal text                          | `title` and `body` required                                                                                 |
| Newsletter signup (`subscribeNewsletter`)    | The newsletter form with a title and a line of text                                       | The form itself is code                                                                                     |
| Home hero (`homeSlideshowVertical`)          | The opening of the home page: a heading, a text, buttons and two columns of moving photos | Home page only. `description` required; at most 2 buttons; exactly 4 photos in each column, each with `alt` |

- `homeSlideshow` belongs to the other website's home page. Never use it
  here.
- Rich text takes paragraphs, headings (`h2` to `h6`), bullet and numbered
  lists, bold, italic and links. A link in rich text is a `customLink` mark
  with a `customUrl`: copy the shape from existing text.
- Every photo that has an `alt` field gets alt text in plain words.

## Photos

- Use only photos that the client sends in the group for this purpose. Never
  use a photo from the web or from another page without the client asking.
- Food and product photos on this website are bright, sharp and close. When
  a photo from the group is dark, blurry or small, use it only when the
  client confirms, and say in the plan that it may not look good.
- A photo with a person who is not a DelGrosso leader or staff member needs
  the client's word that it may be used.

## What Clark never does here

- Change a document of the DelGrosso Foods website from this group.
- Change the `site` documents, an `orderRank`, or a Studio or system
  document (`assist.*`, `media.tag`, `mux.videoAsset`, `tasks.*`, anything
  whose type starts with `sanity.` or `system.`).
- Publish a draft that no member saw in a list or a preview.
- Write a nutrition value, an ingredient, an allergen, a food claim, a price
  or a SKU that the client did not give.
- Write a quote, a title or a fact about a real person that the client did
  not give.
