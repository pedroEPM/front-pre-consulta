FROM node:14.15.0
ENV HOST 0.0.0.0 PORT 3003

RUN mkdir -p /usr/src/front-preconsulta
WORKDIR  /usr/src/front-preconsulta

 

COPY . .

EXPOSE 3003

RUN npm install
RUN npm i vue-html2pdf
RUN npm run build
EXPOSE 3003
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3003

CMD [ "npm", "start" ]
