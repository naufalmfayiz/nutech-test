# How To Run

## Install Package

jalankan "npm install" di terminal
&nbsp;

## Config PostgreSQL connection

sesuaikan dengan postgre di local computer pada file config.js. Dengan catatan sudah menginstall pg di local computer
&nbsp;

## Config .env file

buat file .env dan isi JWT_SECRET
&nbsp;

## Migrate

jalankan "node migration.js" di terminal
&nbsp;

## Run Server

jika berhasil migration maka jalankan "npx nodemon app" di terminal
