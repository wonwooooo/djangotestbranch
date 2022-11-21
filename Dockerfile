FROM python:3.9-slim
ENV PYTHONUNBUFFERED 1
RUN mkdir /srv/docker-server
ADD . /srv/docker-server
WORKDIR /srv/docker-server
RUN apt-get update
RUN apt-get install -y python3-dev default-libmysqlclient-dev build-essential
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install mysqlclient
EXPOSE 8000
