const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email("Parameter email tidak sesuai format"),
});

module.exports = loginSchema;
