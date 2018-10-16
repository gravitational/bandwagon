HOOK_TAG := bandwagon-hook:$(VERSION)

.PHONY: hook
hook:
	$(eval CHANGESET = $(shell echo $$VERSION | sed -e 's/[\.]//g'))
	if [ -z "$(CHANGESET)" ]; then \
	  echo "VERSION is not set"; exit 1; \
	fi;
	docker build --pull -t $(HOOK_TAG) \
		--build-arg CHANGESET=bandwagon-$(CHANGESET) hook
