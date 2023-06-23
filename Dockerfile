FROM node:14

ENV baseURL "http://localhost:3000/api/v1/"
ENV RCON_HOST ""
ENV RCON_PASSWORD ""
ENV RCON_PORT 21114
ENV JWT_SECRET ""
ENV DB_HOST ""
ENV DB_USER ""
ENV DB_PASS ""
ENV DB_BASE ""
ENV DB_DIAL ""
ENV DB_PORT ""

EXPOSE 3000

RUN yarn global add @vue/cli
WORKDIR /usr/src/sqcp
COPY backend ./backend
COPY frontend/squad-control-panel ./frontend
COPY entrypoint.sh ./entrypoint.sh

WORKDIR /usr/src/sqcp/frontend
RUN yarn install
RUN yarn build
RUN cp -R ./dist ../backend/

WORKDIR /usr/src/sqcp/backend
RUN yarn install

ENTRYPOINT ["/bin/bash", "/usr/src/sqcp/entrypoint.sh"]
CMD [ "yarn", "start" ]