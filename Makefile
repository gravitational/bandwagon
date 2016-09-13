VER := 1.0.0
NAME := bandwagon
PACKAGE := gravitational.io/$(NAME):$(VER)
OPS_URL ?= https://opscenter.localhost.localdomain:33009
GRAVITY ?= gravity

CURRENT_DIR := $(shell pwd)
BUILD_DIR := $(CURRENT_DIR)/build
WEB_APP_DIR := $(CURRENT_DIR)/web

BUILDBOX_IMAGE := gravity-buildbox:latest


.PHONY: all
all: build


.PHONY: build
build: web-build go-build
	docker build -t $(NAME):$(VER) .


.PHONY: push
push:
	docker tag $(NAME):$(VER) apiserver:5000/$(NAME):$(VER)
	docker push apiserver:5000/$(NAME):$(VER)


.PHONY: run
run: build
	docker run -p 8000:8000 $(NAME):$(VER)


.PHONY: import
import: build
	$(GRAVITY) --insecure app delete $(PACKAGE) --force --ops-url=$(OPS_URL) && \
	$(GRAVITY) --insecure app import ./app --vendor --ops-url=$(OPS_URL)


.PHONY: web-build
web-build:
	$(MAKE) -C $(WEB_APP_DIR) docker-build


.PHONY: go-build
go-build: $(BUILD_DIR)/$(NAME)


$(BUILD_DIR)/$(NAME):
	docker run -i --rm=true -v $(CURRENT_DIR):/gopath/src/github.com/gravitational/$(NAME) $(BUILDBOX_IMAGE) \
		/bin/bash -c "make -C /gopath/src/github.com/gravitational/$(NAME) go-build-in-buildbox"


.PHONY: go-build-in-buildbox
go-build-in-buildbox:
	cd /gopath/src/github.com/gravitational/$(NAME) && \
	go get && \
	go build -o ./build/$(NAME)


.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
