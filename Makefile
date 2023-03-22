# Can run 4 parallel jobs at the same time
MAKEFLAGS += --jobs 4

.MAIN: help

help:           ## Show this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


.PHONY: dev
dev: node_modules ## Dev
	@npm run dev -- --open

.PHONY: build
build: node_modules
	@npm run build

node_modules:
	@npm install

.PHONY: clean
clean: ##
	rm -rf ./node_modules/
