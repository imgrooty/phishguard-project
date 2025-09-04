import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
   user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string; // add provider here
    } & DefaultSession["user"];
    access_token?: string;
    refresh_token?: string; // optional
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string; // Add access_token here
    refresh_token?: string; // optional
    provider?: string; // optional
  }
}