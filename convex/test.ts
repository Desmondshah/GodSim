import { query } from "./_generated/server";

export const testQuery = query({
  args: {},
  handler: async () => {
    return "test";
  },
});
