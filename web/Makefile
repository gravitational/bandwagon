REPO_VER_TAG := $(shell git describe --tags --abbrev=8)
CONTAINER_NAME := bandwagon-web-container-$(REPO_VER_TAG)-$(shell bash -c 'echo $$RANDOM')
IMAGE_NAME := bandwagon-web:6.0.0
HOST_DIR="$$(pwd)"

#
# Builds dist files
#
.PHONY:docker-build
docker-build:
	rm -rf $(HOST_DIR)/build
	docker build --force-rm=true -t $(IMAGE_NAME) .
	docker create --name $(CONTAINER_NAME) -t $(IMAGE_NAME) && \
	docker cp $(CONTAINER_NAME):/app/build $(HOST_DIR)
	docker rm $(CONTAINER_NAME) | true

#
# Removes the local Docker container
#
.PHONY: docker-clean
docker-clean:
	docker rmi --force $(IMAGE_NAME)

#
# 'make docker-enter' builds a Docker container with a website
#
.PHONY:docker-enter
docker-enter:
	docker run -ti --rm=true -t $(IMAGE_NAME) /bin/bash

#
# 'make build' installs missing packages required for `make local` to run
#
.PHONY:build
build:
	npm install
	npm run build

#
# Removes installed node modules
#
.PHONY:clean
clean:
	rm -rf node_modules
	rm -rf dist