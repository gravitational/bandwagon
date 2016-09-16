FROM quay.io/gravitational/debian-tall:0.0.1

COPY build/bandwagon /opt/bandwagon/
COPY web/dist /opt/bandwagon/web/dist

EXPOSE 8000

ENTRYPOINT ["/opt/bandwagon/bandwagon"]
