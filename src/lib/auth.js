import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins"; // add this

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("resellhub");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [jwt()], // add this
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "buyer",
        input: true,
      },
    },
  },
  databaseHooks: {
  user: {
    create: {
      before: async (user) => {
        const allowedRoles = ["buyer", "seller"];
        const role = allowedRoles.includes(user.role) ? user.role : "buyer";
        return { data: { ...user, role } };
      },
    },
  },
  session: {
    create: {
      before: async (session) => {
        // check if user is blocked before creating session
        const user = await db.collection("user").findOne({ _id: session.userId })
        if (user?.status === "blocked") {
          throw new Error("Your account has been blocked. Please contact support.")
        }
        return { data: session }
      },
    },
  },
},

});