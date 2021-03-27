<div align="center">

<img src="images/sqcp.png" alt="Logo" width="500"/>

#### Squad Control Panel (SQCP)

<br />
</div>

## **About**

**Squad Control Panel** (**SQCP**) is a simple **Open-Source** solution for **administrating** your **Squad** game server written in [Node JS](https://nodejs.dev/) ([Express](https://expressjs.com/)) and [Vue JS](https://vuejs.org/) ([Vuetify Framework](https://vuetifyjs.com/)), utilizing the [RCON protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol) and [MySQL database](https://www.mysql.com/).

<br>

## **Features**

-   Authentication (login) system
-   Management of online players (kick, ban, warn and team switch the player)
-   Management of recently disconnected players (ban a recently disconnected player)
-   Management of squads (disband a squad)
-   Management of the server bans (add, edit or remove a ban) (**Super Admin only**)
-   Management of the server roles (groups) and admins (**Super Admin only**)
-   Management of the panel admins/users (**Super Admin only**)
-   RCON Console (Super Admin only)
-   Action log (every single action is logged permanently) (**Super Admin only**)
-   Layer changing (**_NOT IMPLEMENTED YET, TODO_**)
-   Two types of panel admins accounts: **Super Admin** and **Normal Admin**
-   Single server support (as of now)

<br>

## **What it does not include**

-   Server start/restart (You can add it if you are hosting the server on your own machine or if your hosting has an API for that)
-   FTP (If there is enough interest, this can be implemented too)

<br>

## **Screenshots**

If you want to see how it looks like, click [here](docs/images.md)

<br>

## **Setup**

To learn how to setup the panel, click [here](docs/setup.md)

<br>

## **The idea behind the project**

**Squad** as a game does not support any GUI options for player management (as of now), player Steam ID or name auto-completion, action (command execution) logging, admins from my gaming community **Balkans Special Forces (BSF)** have struggled to keep up with lots of player requests at the same time, no matter how many admins were online. Player names and Steam IDs have to be typed out in the commands every time, this can get really boring and painful, especially when there are players with non-English alphabet characters in their name. So, I came to an idea to make a GUI tool for server management. In the beginning, it was rather a simple PHP script written using [Squad RCON PHP](https://github.com/Deutsche-Squad-Gemeinschaft/squad-rcon-php), but due to some game updates and a lack of maintenance, the library was not working as intended, so I've decided to write this project using Node JS and [Squad JS](https://github.com/Thomas-Smyth/SquadJS) (RCON part) which is a reliable library. I then had a lot of ideas that could make the lives of server owners and admins easier, so I've implemented them, but I kept this project simple, I've not implemented every single in fear that it would become too bloated. Maybe in the future, I will add some more features, but for now, this should be enough, at least for our (BSF) needs. You have complete freedom to use and change this according to your needs and to contribute and make it better.

<br>

## **List of ideas/features that are not implemented/TO-DOs**

#### _But should get implemented in the future_

-   Ability to configure the permissions for panel admin accounts instead of having 2 account types.
-   Ability to change or set next layer via GUI (_you currently can use the RCON console as a super admin for this_)
-   Ability for a panel admin to change his own account information (currently only super admins can do this)
-   Personal notes for panel admins
-   Discord Webhook integration for action logs
-   Ability to transfer a whole squad to another team
-   Squad JS integration (more info down below)
    -   This will enable real-time chat, real-time kill feed, various statistics (graphs), real-time admin requesting, and a lot of different possibilities
-   Real-time chat for admins on the panel
-   Panel update check
-   Code refactoring and porting the codebase to TypeScript
-   Preconfigured commands (just click and execute) + command execution scheduler
-   Multi-Server support (if there is enough interest)
-   Using Squad RCON as a worker which works non-stop in the background (maybe?)
-   GrapQL support for custom front end clients
-   Ability to change the refresh time for the player and squads lists individually
-   Ability to customize the ban/kick message from the panel instead of changing the code
-   Document the API using Swagger
    <br>

## **Some important notes on the project**

-   **The project is completely Open-Source and free, you are free to use it and change it according to your needs**
-   The code is not that great, it could be improved a lot, I am a beginner in the world of Vue JS and the backend code is not that great either (especially the Sequelize validation error catching) and done as fast as humanly possible, I am looking forward to improving the code when I have some spare time, the important thing is that it works, but if you have the time and will you can help with this.
    PS: And the formatting which Prettier does is not that great too, I could not configure it to work as I intended.
-   UI is not that great and is a little bit rough on the edges, but it is functional (which is the most important thing) and decent enough, as I've said I am new to Vue JS and Vuetify, and I am not primarily a front end developer.
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

Both:

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

If you like this project and you have found it useful, and you are willing to support it, you can donate using Pay Pal, ETH, BTC, and Github. Thank you!

-   Pay Pal: milutinke@gmx.com
-   ETH: `0xa8121Ee49A83f0541ca71D4B4cbEa3a0AEE70f7d`
-   BTC: `3NWiVCSAzkMhZZJxKnTqCVTSnRXNzHH1k6`

<br>

## **License**

```
MIT License

Copyright (c) 2021 Dusan Milutinovic

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
