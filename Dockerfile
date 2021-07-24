FROM ubuntu:18.04
WORKDIR /projects/getbee_backend
RUN apt-get update
RUN apt-get install -y unoconv curl git build-essential
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && apt-get update && apt-get install -y yarn
ADD . ./
# Change Logo=0 to fix unoconv 100% CPU. http://webnetkit.com/soffice-bin-using-100-cpu-moodle/
CMD [ "/bin/bash", "entrypoint.sh" ]