import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

const DEMO_EMAIL = "demo@kuvaka.io";
const DEMO_PASSWORD = "demo123";

async function ensureDemoUser() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);

  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      name: "Demo User",
      email: DEMO_EMAIL,
      password,
      role: "user",
    },
  });
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (
            !credentials?.email ||
            !credentials?.password
          ) {
            throw new Error(
              "Email and password required"
            );
          }

          let user =
            await prisma.user.findUnique({
              where: {
                email: credentials.email,
              },
            });

          if (!user && credentials.email === DEMO_EMAIL) {
            await ensureDemoUser();

            const seededUser = await prisma.user.findUnique({
              where: {
                email: DEMO_EMAIL,
              },
            });

            if (seededUser) {
              user = seededUser;
            }
          }

          if (!user) {
            throw new Error(
              "User not found"
            );
          }

          const passwordValid =
            await bcrypt.compare(
              credentials.password,
              user.password
            );

          if (!passwordValid) {
            throw new Error(
              "Invalid credentials"
            );
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error(
            "AUTH ERROR:",
            error
          );

          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};