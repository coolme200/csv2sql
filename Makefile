TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
TIMEOUT = 10000
MOCHA_OPTS =
REPORTER = tap
PROJECT_DIR = $(shell pwd)
JSCOVERAGE = ./node_modules/jscover/bin/jscover
NPM_INSTALL_PRODUCTION = PYTHON=`which python2.6` NODE_ENV=production npm install
NPM_INSTALL_TEST = PYTHON=`which python2.6` NODE_ENV=test npm install

install:
	@$(NPM_INSTALL_PRODUCTION)

install-test:
	@$(NPM_INSTALL_TEST)

#test: install-test
test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
	-b --reporter $(REPORTER) --timeout $(TIMEOUT) $(MOCHA_OPTS) $(TESTS)

cov:
	@rm -rf cov
	@$(JSCOVERAGE) --exclude=test --exclude=public --exclude=tmp \
		--exclude=bin --exclude=conf . cov
	@cp -rf ./node_modules ./test cov

test-cov: cov
	@$(MAKE) -C ./cov test REPORTER=dot
	@$(MAKE) -C ./cov test REPORTER=html-cov > $(PROJECT_DIR)/coverage.html

clean:
	@rm -f coverage.html

.PHONY: install install-test test test-cov cov clean