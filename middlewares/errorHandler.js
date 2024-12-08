function errorHandler(err, req, res, next) {
  let status = err.status;
  let message = err.message;
  let customStatus = null;

  switch (err.name) {
    case "InvalidToken":
    case "JsonWebTokenError":
      status = 401;
      customStatus = 108;
      message = "Token tidak tidak valid atau kadaluwarsa";
      break;
    case "InvalidService":
      status = 401;
      customStatus = 102;
      message = "Service atau layanan tidak ditemukan";
      break;
    case "InsufficientBalance":
      status = 401;
      customStatus = 101;
      message = "Saldo tidak mencukupi";
      break;
    case "ZodError":
      status = 400;
      customStatus = 102;
      message = err.errors[0].message;
      break;
    case "InvalidUser":
      status = 401;
      customStatus = 103;
      message = "Username atau password salah";
      break;

    default:
      status = 500;
      message = "Internal Server Error";
      break;
  }

  return res.status(status).json({ status: customStatus, message, data: null });
}

module.exports = errorHandler;
