const config = {
  user: "UserSC",
  password: "CleanMe",
  server: "SERVER", // Cambia esto por la dirección de tu servidor SQL Server
  database: "CleanMe",

  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
  },
  port: 1433,
};

module.exports = config;
