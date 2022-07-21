<div align="center">

<img src="images/sqcp.png" alt="Logo" width="500"/>

#### Squad Control Panel (SQCP)

<br />
</div>

## **About**

**Squad Control Panel** (**SQCP**) is a simple **Open-Source** solution for **administrating** your **Squad** game server written in [Node JS](https://nodejs.dev/) ([Express](https://expressjs.com/)) and [Vue JS](https://vuejs.org/) ([Vuetify Framework](https://vuetifyjs.com/)), utilizing the [RCON protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol) and [MySQL database](https://www.mysql.com/).

Features list bellow the **News** section.

<br>

## **News**

**21 of July 2022** - Hello everyone, in the coming months I'll be rewriting the project code base, the back end will be using Squad JS for RCON and live updates feature and the code base will be rewritten in Typescript using the following architecture: 
`Request <-> Express <-> Controller <-> Service <-> Repository <-> DAO`.

Technologies which I plan to use for back end:
 - Typescript
 - Type ORM
 - Express
 - Eslinter
 - Docker
 - Swaggers

The frontend will most likely be written in Vue 3 but using Quasar this time instead of Vuetify.
I'll also make a docker image.

Planned features:
 - Multi server support
 - Admin account permissions (instead of 2 hard coded account types)
 - Admin chat (just on the panel, not in-game)
 - Admin notes
 - Player profiles (with play history, statistic, chat history, warnings history)
 - Live chat feed
 - Live team kills feed
 - Live connect/disconnect feed
 - Live admin requests and notifications
 - Server-side pagination for all tables
 - Pre-configured commands and a command scheduler
 - Pre-configured ban/kick/warning reasons
 - Discord web hook integration for logs
 - Transfer squad to other team option

Some additional plans:
 - Ability to change the API link dynamically on the frontend without recompiling (You will be required to provide the backend url before being able to login, just for the first time). This will enable a public pre-built release to ease the setup. And we could boot up a publicly hosted frontend on Netlify.

NOTE: Since the project will be completely rewritten from 0, I'll not be providing backwards compatibility with the old database in the code base itself.
I'll probably make a separate tool for porting old bans, logs and roles to the new system for those who do not know how to export SQL.

As for the old codebase, it will be moved to a legacy branch once the new one is tested and stable.

**When I start, donations would be very appreciated since I need to get a VPS and a server for testing.**

Also, if you're interested, feel free to contribute with ideas of your own by opening an issue or making a pull request.
If there is interest I could make a public Trello board and complete explanation of the planned architecture.

<br>

## **Features**

-   Authentication system based on JWT
-   Allows you to see the online players and to perform the following actions on them: kick, ban, warn, move (change teams)
-   Allows you to see the teams and squads in them in a nice layout with an option to disband a squad if needed
-   Allows you to see the recently disconnected players which you can ban if you need to
-   Allows you to see the banned players and to perform the following actions on them: edit ban, remove ban and add a ban manually (Also has a route for ban exports) (**Super Admin only**)
-   Allows you to create Roles (groups) which have permissions and to create, edit or delete admins with those roles. (**Super Admin only**)
-   Allows you to execute RCON commands in a console (**Super Admin only**)
-   Every single action is logged in a permanent log called Action Logs. (**Super Admin only**)
-   Two types of panel admins accounts: **Super Admin** and **Normal Admin**

<br>

## **What it does not include (for now)**

-   Web FTP
-   Multi-server support
-   Server start/restart
-   Full Squad JS integration (it only uses a part of Squad JS code)

<br>

## **Screenshots**

If you want to see how it looks like, click [here](docs/images.md)

<br>

## **Setup**

To learn how to setup the panel, click [here](docs/setup.md)

<br>

## **The idea behind the project**

**Squad** as a game does not support any GUI options for player management (as of now), player Steam ID or name auto-completion, action (command execution) logging, admins from my gaming community **Balkans Special Forces (BSF)** have struggled to keep up with lots of player requests at the same time, no matter how many admins were online. Player names and Steam IDs have to be typed out in the commands every time, this can get really boring and painful, especially when there are players with non-English alphabet characters in their name. So, I came to an idea to make a GUI tool for server management. In the beginning, it was rather a simple PHP script written using [Squad RCON PHP](https://github.com/Deutsche-Squad-Gemeinschaft/squad-rcon-php), but due to some game updates and a lack of maintenance, the library was not working as intended, so I've decided to write this project using Node JS and [Squad JS](https://github.com/Thomas-Smyth/SquadJS) (RCON part) which is a reliable library. I then had a lot of ideas that could make the lives of server owners and admins easier, so I've implemented them, but I kept this project simple, I've not implemented every single in fear that it would become too bloated. In the future, I will add some more features, but for now, this should be enough, at least for our (BSF) needs and I do not have much time because of the university. You have complete freedom to use and change this according to your needs and to contribute and make it better.

<br>

## **Some important notes on the project**

-   **The project is completely Open-Source and free, you are free to use it and change it according to your needs**
-   Some people may wonder why this project did not utilize the whole of Squad JS instead of just a single part of it. The reason behind that is that we as a community have FTP issues with our current hosting, which causes Squad JS to stop working as it is dependent on FTP in order to operate. We needed this urgently,
    so I decided to use a single part of Squad JS.
    **My original idea was in fact to build this upon Squad JS**, but I could not wait to resolve FTP issues. (_By the way there is a Squad JS contributor who is working on the Squad JS control panel using React, so I will probably help on that project too, using my ideas from this one_).
-   Why I haven't included Multi-Server support? Well, as we have only 1 server, and no plans to expand any time soon, as I do not have that much spare time and admins of each server must be different people as OWI requires, I have decided to make it a single server. But, you can always host this for each of your servers if needed, or you can contribute and make it multi-server, but this will require lots of changes.

<br>

## **Technologies used**

Backend:

-   [Node JS](https://nodejs.dev/)
-   [Express](https://expressjs.com/)
-   [Sequelize ORM](https://sequelize.org/)
-   [MySQL](https://www.mysql.com/)
-   [Squad JS](https://github.com/Thomas-Smyth/SquadJS) (RCON part)

Frontend:

-   [Vue](https://vuejs.org/)
-   [Vuex](https://vuex.vuejs.org/)
-   [Vue Router](https://router.vuejs.org/)
-   [Vuetify](https://vuetifyjs.com/)

Common:

-   [Yarn](https://yarnpkg.com/)
-   [Prettier](https://prettier.io/)

<br>

## **Contibuting**

My idea for this project is to be a community project, so I am looking for active contributors who would like to improve this project and bring more ideas.
Because I was taught to use SVN and Redmine, I am not that familiar with Git, so I will have to learn how to setup CI and tests in this ecosystem.
If someone is willing, you can share some ideas with me and help me do it.
PS: I also need to organize the Pull Requests categories. And, do not forget to run `yarn prettier`
<br>

## **Credits**

-   [**Thomas Smyth**](https://github.com/Thomas-Smyth/SquadJS), [**Marcel Davis**](https://github.com/SquadMS/SquadMS-RCON-Worker), [**Larinel**](https://github.com/Larinel/rcon) and [**Enrique Carpintero**](https://github.com/EnriqCG/rcon-srcds) for their work on **Squad RCON** protocol library for Node JS

<br>

## **Support**

If you like this project and you have found it useful, and you are willing to support it, you can donate using Pay Pal or ETH. Thank you!

-   Pay Pal: milutinke@gmx.com
-   ETH: `0xa8121Ee49A83f0541ca71D4B4cbEa3a0AEE70f7d`

<br>

## **License**

```
MIT License

Copyright (c) 2022 Milutinke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
