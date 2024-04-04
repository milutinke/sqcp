#entrypoint.sh

cd /usr/src/sqcp/backend
npx sequelize db:migrate --config Config/database.json
npm run create-admin
yarn start