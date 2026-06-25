#!/bin/sh

echo "Waiting for MySQL to start..."
./wait-for db:3306 

echo "Migrating the databse..."
bun run db:up 

echo "Starting the server..."
bun start 