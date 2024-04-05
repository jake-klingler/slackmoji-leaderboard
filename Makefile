.PHONY: scrape
scrape:
	npm install
	npx playwright test --debug --project=chromium

.PHONY: process
process:
	node process.mjs
