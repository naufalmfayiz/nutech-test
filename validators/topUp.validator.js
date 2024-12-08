const { z } = require("zod");

const topUpSchema = z.object({
  top_up_amount: z
    .number({
      message:
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    })
    .int({
      message:
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    })
    .min(1, {
      message:
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    }),
});

module.exports = topUpSchema;
