
.PHONY: test

test:
	npx http-server -c-1

build:
	npm run webpack
