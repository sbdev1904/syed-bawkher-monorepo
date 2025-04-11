import NextAuth from "next-auth";
import { authOptions } from "./authOptions";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    name: string;
    role: Role;
  }

  interface JWT {
    id: string;
    name: string;
    role: Role;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
