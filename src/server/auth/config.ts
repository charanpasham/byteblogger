import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export async function UploadProfilePicture(imageUrl: string, id: string) {
  const utapi = new UTApi();
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], `${id}.jpg`, { type: "image/jpeg" });
  const uploaded = await utapi.uploadFiles(file);
  return uploaded.data;
}

export const authConfig = {
  providers: [
    DiscordProvider,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (profile) => {
        const baseProfile = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
        };

        try {
          const exisitingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, profile.email));

          if (exisitingUser.length === 0) {
            const newProfileImageUrl = await UploadProfilePicture(
              profile.picture,
              profile.sub,
            );
            return {
              ...baseProfile,
              role:
                baseProfile.email === "scharan19@gmail.com" ? "admin" : "user", // Assign admin role to specific email
              image: newProfileImageUrl?.ufsUrl,
            };
          } else {
            return {
              ...baseProfile,
              role: exisitingUser[0]?.role, // Use existing user's role
            };
          }
        } catch (error) {
          console.error("Error fetching or creating user:", error);
          return {
            ...baseProfile,
            role: "user", // Default to user role if there's an error
          };
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
