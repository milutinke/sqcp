#entrypoint.sh

cd ./backend
sequelize db:migrate --config Config/database.json
npm run create-admin
yarn start