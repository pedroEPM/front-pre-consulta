#!/bin/bash
echo deteniendo y eliminando la contenedor anterior
sleep 1
docker stop front-preconsultatest
docker rm front-preconsultatest
sleep 1
echo eliminando imagen anterior 
sleep 1
docker rmi front-preconsultatest
sleep 1
echo creando nueva imagen de front-preconsultatest
sleep 1
docker build -t front-preconsultatest .
echo ejecutando el contenedor front-preconsultatest

docker run --name front-preconsultatest -p 3003:3003 -v /home/public/front-preconsultatest:/usr/src/front-preconsultatest/public -v /home/public/front-preconsultatest:/usr/src/front-preconsultatest/files-to-upload -d front-preconsultatest
echo listo.
