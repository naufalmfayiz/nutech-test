const { z } = require("zod");

const userSchema = z.object({
  email: z
    .string()
    .email("Parameter email tidak sesuai format")
    .min(1, "Email must be at least 1 character long"),
  first_name: z.string().min(1, "First name must be at least 1 character long"),
  last_name: z.string().min(1, "Last name must be at least 1 character long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

module.exports = userSchema;
