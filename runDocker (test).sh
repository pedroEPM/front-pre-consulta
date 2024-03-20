#!/bin/bash
echo deteniendo y eliminando la contenedor anterior
sleep 1
docker stop front-preconsultatest3
docker rm front-preconsultatest3
sleep 1
echo eliminando imagen anterior 
sleep 1
docker rmi front-preconsultatest3
sleep 1
echo creando nueva imagen de front-preconsultatest3
sleep 1
docker build -t front-preconsultatest3 .
echo ejecutando el contenedor front-preconsultatest3

docker run --name front-preconsultatest3 -p 3004:3004 -v /home/public/front-preconsultatest3:/usr/src/front-preconsultatest3/public -v /home/public/front-preconsultatest3:/usr/src/front-preconsultatest3/files-to-upload -d front-preconsultatest3
echo listo.
