// The standard next-sanity path for turning draft mode on. Clark, the Telegram
// editing bot, sends its preview links here (see docs/agents/clark.md). The
// Studio's Visual editor still uses /api/presentation-draft; both paths run
// the same handler.
export { GET } from "../../presentation-draft/route";
