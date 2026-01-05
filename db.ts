import mysql from "mysql2/promise";

export const connection = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "Redhat@123",
    database: "sample",
  });

