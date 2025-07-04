# To run in local development:
1) cp .env.example .env     (standard database settings to connect to local postgres instance in docker)
2) docker compose -d        (run the postgres instance)
3) npm start                (run node/nest)

This should be enough to run application for the local development.

To check the status of application GET on /health enpoint.
It shows the status of database connection as well.