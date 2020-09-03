CLIENT="build/detun.js"
SERVER="build/detun-server.js"
TEST_VAR=123

.PHONY: build
build: clean
	deno bundle client/main.js $(CLIENT)
	deno bundle server/main.js $(SERVER)

.PHONY: clean
clean:
	rm -vrf build
	mkdir -p build

.PHONY: deploy-brook-sg
deploy-brook-sg: build
	scp $(SERVER) $(CLIENT) brook-sg:
	ssh brook-sg "\
		pm2 -s delete detun-server; \
		pm2 -s start --time --name detun-server deno -- run --allow-net detun-server.js && \
		pm2 -s save \
	"

.PHONY: dev-client
dev-client:
	deno run --allow-net client/main.js 3000 --publicPort 3001 --hostname localhost --verbose

.PHONY: dev-server
dev-server:
	npx nodemon --exec "deno run --allow-net server/main.js --verbose"

.PHONY: test
test:
	echo $$(pwd)
