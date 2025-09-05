# Tag Parser for Image Boards

A lightweight web tool to fetch and parse tags from various imageboard and booru-style websites.  
Designed to work in-browser using JavaScript with CORS proxies for fetching HTML content.

---

## Features

- Fetch tags from a variety of booru-style sites.
- Automatically categorizes tags into types: `artist`, `character`, `copyright`, `metadata`, `deprecated`, or `general`.
- Supports cached results for repeated requests to the same URL.
- Displays tags with optional coloring and formatting.
- Handles multiple CORS proxy services to bypass restrictions.
- Easily extendable for additional sites.

---

## Supported Sites

The parser currently supports the following websites:

- Gelbooru (`gelbooru.com`)
- Danbooru (`danbooru.donmai.us`, `sonohara.donmai.us`, `donmai.moe`)
- Rule34 (`rule34.xxx`)
- TBIB (`tbib.org`)
- Yande.re (`yande.re`)
- Safebooru (`safebooru.org`)
- Xbooru (`xbooru.com`)
- Hypnohub (`hypnohub.net`)
- Konachan (`konachan.com`)
- E621 (`e621.net`)
- Derpibooru (`derpibooru.org`)
- Realbooru (`realbooru.com`)
- Rule34 Paheal (`rule34.paheal.net`)
