# Paywall Filter

Badges paywalled search results, except sites you already subscribe to.

No paywall bypassing, no scraping around anything — just honest filtering so
you don't click into a result you can't actually read.

## Why this exists

Kagi [shipped a setting](https://news.ycombinator.com/item?id=49388154) to
hide paywalled links from search results entirely. The launch thread filled
up fast with the same request: people who already pay for the New York
Times, or the FT, or wherever, don't want those hidden — just everything
they *don't* subscribe to. Kagi's toggle is all-or-nothing. This isn't.

## What it does

On Google, Bing, DuckDuckGo, Kagi, and Brave Search results pages, it checks
every result link against a curated list of commonly-paywalled domains and
drops a small badge next to the ones that are gated — 🔒 hard paywall,
🔒 metered (a few free articles then it blocks you), or a lighter badge for
soft/partial paywalls. Any domain you've added to your own subscribed-sites
list stays unbadged.

## Install

1. Download and unzip the [latest release](../../releases/latest).
2. Go to `chrome://extensions`, turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the unzipped folder.
4. Click the extension icon on any page you already subscribe to and hit
   "I subscribe to [domain]" — or manage the whole list from the extension's
   options page.

Chrome (and other Chromium browsers — Edge, Brave, etc.) only for now.

## Known paywalled domains

The list lives in [`paywalled-domains.js`](paywalled-domains.js) and is
curated, not exhaustive. Missing one you run into constantly? Open an issue
or a PR — it's a one-line addition.

## License

MIT — see [LICENSE](LICENSE).

---

If this saved you a click into something you can't read,
[buy me a coffee](https://venmo.com/u/masseyinfinitellc).
