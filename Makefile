CLIENT="build/detun.js"
SERVER="build/detun-server.js"
DEPLOY_TMP_DIR="/tmp/detun-build"

.PHONY: build
build: clean
	deno bundle client/main.js $(CLIENT)
	deno bundle server/main.js $(SERVER)

.PHONY: clean
clean:
	rm -vrf build
	mkdir -p build

.PHONY: deploy
deploy: build
	rm -vrf $(DEPLOY_TMP_DIR)
	mkdir -p $(DEPLOY_TMP_DIR)
	git clone https://github.com/elemti/detun --depth 1 --branch release $(DEPLOY_TMP_DIR)
	rsync -avz --delete --cvs-exclude build/ $(DEPLOY_TMP_DIR)
	cd $(DEPLOY_TMP_DIR) && git add . && git commit -m 'make deploy' && git push

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
