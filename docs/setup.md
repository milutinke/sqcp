## **Important**

By default, CORS is enabled for all. If you are hosting the front end locally, make sure you configure it in `App.js`.
Also, do not disable `connect-history-api-fallback` since Vue Router is running in the history mode.

<br >

## **Prerequisites**

In order to build and host SQCP, you will need the following things installed:

-   [Node JS runtime](https://nodejs.dev/)
-   [Yarn Package Manager](https://yarnpkg.com/) (_installed globaly_)
-   [VUE CLI](https://cli.vuejs.org/guide/installation.html) (_installed globaly_)
-   [MySQL Database](https://www.mysql.com/)

Not required, but recommended to run your process using:

-   [PM2 Process Manager](https://pm2.keymetrics.io/) (_installed globaly_)
-   More info about PM2: https://pm2.keymetrics.io/docs/usage/quick-start/

<br >

## **Useful videos/resources**

_For people who are not familiar with this stuff_

-   Connecting to remote maching using SSH: https://www.youtube.com/watch?v=jCTI1bfjEHU
-   Basic linux commands: https://www.youtube.com/watch?v=cBokz0LTizk
-   Screen command usage: https://www.youtube.com/watch?v=Mw6QvsChxo4
-   PM 2 tutorial: https://www.youtube.com/watch?v=ebdKIU6SDHI
-   How to install Node JS:
    -   Ubuntu/Debian: https://www.youtube.com/watch?v=D9qs-f66xGU
    -   Centos: https://www.youtube.com/watch?v=pg_3zlnqNl4
-   How to install and setup MySQL server:
    -   Ubuntu/Debian: https://www.youtube.com/watch?v=KI6TBUzyqXU
    -   Centos: https://www.youtube.com/watch?v=CZvf_k99C0Q
-   Full Node.js Deployment - NGINX, SSL With Lets Encrypt: https://youtu.be/oykl1Ih9pMg
-   Deploy any Node.JS Web Application with NGINX!: https://www.youtube.com/watch?v=WsZC7cE0-NE
-   If you prefere Apache over Nginx: https://www.youtube.com/watch?v=A3Prx_2YEm8
-   How to generate and use a SSL certificate in NodeJS: https://www.youtube.com/watch?v=USrMdBF0zcg
-   Installing git: https://www.youtube.com/watch?v=ZMgLZUYd8Cw
-   Cloning a repository using git: https://www.youtube.com/watch?v=CKcqniGu3tA

<br >

## **Setup**

_PS: I expect you have a technical background and you already are familiar with web technologies and configuring a gateway, and that you are using Linux to host this, if you struggle somewhere, just google it or watch the videos above_

**The easiest way to deploy is using [Digital Ocean](https://m.do.co/c/970c894d5986), where you have Node JS, Nginx and PM2 preconfigured and installed**

1. Clone the repository using Git or download it as a zip and extract it: `git clone https://github.com/milutinke/sqcp.git`
2. Navigate to `frontend/squad-control-panel/src` and open `main.js`
3. Change `Vue.config.baseURL` value to the URL where your app will be running. (**NOTE: Your url must end with `/api/v1` (without `/` and the end, after `v1`) - Example: `http://localhost:3000/api/v1`**)
4. Save and close the file
5. Navigate to `frontend/squad-control-panel`
6. Open the terminal and run: `yarn install`
7. Once the installation is complete, run: `yarn build`
8. After the build is complete, move the `dist` folder to `backend` folder (delete the old `dist` folder if there is one already)
9. Navigate to `backend/Config`
10. Open `index.js` and change your RCON information and JWT secret
11. Open `database.json` and change your database information (We need this file for Sequelize CLI, yeah, it sucks that we have DB info in a separate file)
12. Navigate back to `backend`
13. Open the terminal and run: `yarn install`
14. Once it is done with the installation, run `sequelize db:migrate --config Config/database.json`
15. Once you have successfully done with migrating, you need to generate a default admin account. Navigate to `backend` folder, open up a terminal and execute: `npm run create-admin`, this script will generate a default admin account, and its credentials will be displayed on the screen.
16. You now can run your app:

    - Using `screen` (If you do not have it, just install it: )
        - Run: `screen -dmS sqcp`
        - Then: `screen -r sqcp`
        - Then: `yarn start`
        - You now can exit the screen by pressing `CTRL + A + D`
        - _PS: To return to screen use: `screen -r sqcp`_
        - To stop the app, use `CTRL + C`
    - Using PM2:
        - See this: https://pm2.keymetrics.io/docs/usage/quick-start/
        - Use `App.js`

17. Configure your gateway using Nginx or Apache
18. Access your Squad server files, navigate to `SquadGame/ServerConfig`
19. Open `RemoteAdminListHosts.cfg`, and add the following: `<YOUR_URL>/api/v1/server/admins/text` (Replace `<YOUR_URL>` with url on which this app is hosted), save and close the file
20. Open `RemoteBanListHosts.cfg`, and add the following: `<YOUR_URL>/api/v1/server/bans/text` (Replace `<YOUR_URL>` with url on which this app is hosted), save and close the file. Example: `http://squad-control-panel.com/api/v1/server/admins/text`

21. Restart the server

Congratulations, you are done!
