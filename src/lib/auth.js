import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("resellhub");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "buyer",
        input: true, // allow client to send role at signup, validated below
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Whitelist — only buyer/seller can be self-assigned at signup.
          // Admin accounts must be created manually in MongoDB or via a separate admin-only route,
          // never through public signup.
          const allowedRoles = ["buyer", "seller"];
          const role = allowedRoles.includes(user.role) ? user.role : "buyer";
          return { data: { ...user, role } };
        },
      },
    },
  },
});