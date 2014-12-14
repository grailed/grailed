build:
	@npm install
	@./node_modules/.bin/gulp

clean:
	@rm -rf node_modules bower_components dist

.PHONY: build clean