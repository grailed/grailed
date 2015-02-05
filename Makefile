build:
	@npm install
	@./node_modules/.bin/gulp

clean:
	@rm -rf node_modules

.PHONY: build clean