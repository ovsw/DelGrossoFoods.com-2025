# Clark: editing these websites from Telegram

Clark is the Telegram bot of OVS Websites that edits a client's website
content in Sanity (repo `ovsw/client-editing-portal`). The DelGrosso staff
write a request in a Telegram group; Clark drafts the change, sends a preview
link on the live website, and publishes after a member says yes.

This repo holds two websites on one Sanity project and dataset, so Clark has
two sites and two groups:

| Clark site id | Website               | Live URL                       | Editing guide                |
| ------------- | --------------------- | ------------------------------ | ---------------------------- |
| `dgf`         | DelGrosso Foods       | https://www.delgrossofoods.com | `docs/agents/editing-dgf.md` |
| `lfd`         | La Famiglia DelGrosso | https://www.delgrossosauce.com | `docs/agents/editing-lfd.md` |

Both sites use Sanity project `5tl45xys`, dataset `development` (the live
dataset, despite its name), and time zone America/New_York. Clark supports one
live website per group, which is why the two websites are two Clark sites
and not one.

## What Clark needs from this repo

1. **The editing guides.** Clark gets a site's guide with every request. The
   registry keeps a copy, not a link: after a change to a guide, store it
   again from the `client-editing-portal` repo, with the production
   `DATABASE_URL` and `SITE_TOKEN_KEY` set:

   ```sh
   pnpm registry set-guide --site dgf --file <this repo>/docs/agents/editing-dgf.md
   pnpm registry set-guide --site lfd --file <this repo>/docs/agents/editing-lfd.md
   ```

   The two guides share most of their text. A rule about shared content
   (sauces, recipes, store products, retailers, FAQs, leaders) goes into
   both.

2. **The draft-mode route.** Clark's preview link opens
   `/api/draft-mode/enable` on the live website with a one-time secret, then
   lands on the page with draft content. Both web apps keep that route
   (`src/app/api/draft-mode/enable/route.ts`). It runs the same handler as
   `/api/presentation-draft`, which the Studio's Visual editor uses. The
   preview bar at the bottom of the page lets the visitor leave preview mode.

3. **The deployed schema.** Clark reads the schema that is deployed to the
   dataset, never the code. The "Deploy Sanity Studio" workflow deploys both
   Studios, and with them the schema (`sanity deploy --schema-required`), on
   every push that touches the schema or a Studio. Both Studios use
   `@workspace/sanity-schema`, so the two deployed schemas describe the same
   content types. Never leave a schema change undeployed.

   Two cases deploy nothing: a push by Dependabot (the workflow only builds
   the Studios) and a push to the branch `feat/multisite-dgf-lfd` (the
   workflow ignores it). When a schema change reaches `main` that way, run
   the workflow by hand from the Actions tab ("Run workflow" on `main`).

   The workflow also runs on feature branches, and a branch deploy
   overwrites the deployed schema with the branch's schema. Clark reads the
   newest one. So merge a branch with a schema change soon after its last
   push; when such a branch is dropped, run the workflow again on `main`.

## When something here changes

- A new or changed content type, field or section: update both guides in the
  same pull request (the tables of words, the section library, the rules),
  then store the guides again as above.
- A new rule for what belongs to which website (for example a new sauce line
  or a new store filter): update "Two websites, one set of content" and the
  matching section in both guides.
- A new live URL for a website: the registry holds the URL; change it there.
