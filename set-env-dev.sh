#!/bin/bash
export ENV=TESTING
export DATABASE_URL=postgresql://userdb:qwerty123@localhost:5433/postgresdb?schema=public
exec "$@"
