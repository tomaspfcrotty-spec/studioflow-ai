# Data Sources

## Live Google Sheet
Primary live data source:

- `https://docs.google.com/spreadsheets/d/1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg/edit?usp=sharing`

Sheet ID:

- `1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg`

## Exact CSV endpoints by tab
These are the simplest runtime endpoints for the Cloudflare Worker to fetch.

- `Classes`
  - `https://docs.google.com/spreadsheets/d/1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg/gviz/tq?tqx=out:csv&sheet=Classes`
- `Memberships`
  - `https://docs.google.com/spreadsheets/d/1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg/gviz/tq?tqx=out:csv&sheet=Memberships`
- `Coaches`
  - `https://docs.google.com/spreadsheets/d/1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg/gviz/tq?tqx=out:csv&sheet=Coaches`
- `FAQs`
  - `https://docs.google.com/spreadsheets/d/1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg/gviz/tq?tqx=out:csv&sheet=FAQs`
- `Announcements`
  - `https://docs.google.com/spreadsheets/d/1sU5bLnSKO6cGtx_emZGVwEkZHDNS6pxpvze4UWa4IRg/gviz/tq?tqx=out:csv&sheet=Announcements`

## Expected tabs
- `Classes`
- `Memberships`
- `Coaches`
- `FAQs`
- `Announcements`

## Notes
- These URLs are suitable for public read access from a Cloudflare Worker.
- The Worker should fetch these URLs at query time rather than storing operational values locally.
- If the sheet structure changes, the Worker normalization logic must be updated to match.
