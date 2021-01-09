# FROM node:9.3.0-slim
# Use an official Debian 9 stable as a parent image
FROM ubuntu:18.04

# Make port 2579 available to the world outside this container
EXPOSE 2579

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y vim


RUN apt-get install git build-essential libmicrohttpd-dev libcurl4-openssl-dev -y
RUN apt-get install libuv1-dev -y


#Install nodejs environment
#####################################################################################
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        python \
        rsync \
        software-properties-common \
        devscripts \
        autoconf \
        ssl-cert \
    && apt-get clean

# update the repository sources list
# and install dependencies
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# confirm installation
RUN node -v
RUN npm -v

# Use latest npm
RUN npm i npm@latest -g

############################################################################

#########################CONFIG FOR SSH###################################################
RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:WRgT0khLMcMl3w==' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
EXPOSE 22
#########################CONFIG FOR SSH##################################################

#########################CONFIG FOR SUPERVISOR##########################################
RUN apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
#########################CONFIG FOR SUPERVISOR





WORKDIR /app

ADD package.json /app/package.json
RUN npm config set registry http://registry.npmjs.org
RUN npm install 

ADD . /app

EXPOSE 1337

ENV NODE_ENV development
ENV HTTP_SERVER_PORT 1337
ENV WS_PORT 1338
ENV DOMAIN localhost
ENV HTTP_PROTOCOL http
ENV WS_PROTOCOL ws
# ENV AWS_KEY=
# ENV AWS_SECRET=
# ENV GOOGLE_ID =
# ENV GOOGLE_SECRET =

ENV REDIS_URL redis://redis:6379
ENV REDIS_SCOPE COMLINK

ENV MONGO_USERNAME gustavo
ENV MONGO_PASSWORD 12345678

ENV MONGO_HOST1 mongo
ENV MONGO_PORT1 27017

ENV MONGO_HOST2 127.0.0.1
ENV MONGO_PORT2 28017


ENV REPLICA_NAME test-replica

##CMD ["bash"]
CMD [ "/usr/bin/supervisord" ]
#CMD ["npm", "run", "start"]

#sudo docker run -p 1337:1337 rtns_container