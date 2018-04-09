FROM ubuntu:16

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

# Bundle app source
# Trouble with COPY http://stackoverflow.com/a/30405787/2926832
COPY . /src

EXPOSE 80
EXPOSE 5000-6000

WORKDIR /src

CMD ["./start-scripts.sh"]
