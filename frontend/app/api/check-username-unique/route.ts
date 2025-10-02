import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  searchParams: z.object({
    username: usernameValidation,
  }),
})
export async function GET(request: Request) {
  await dbConnect();

    try {
      const { searchParams } = new URL(request.url);
      const username = searchParams.get("username");
      const result = UsernameQuerySchema.safeParse({ searchParams: { username } });
      console.log("Parsed username:", result);
      if (!result.success) {
        const usernameErrors = result.error.flatten().fieldErrors.username;
        return Response.json({ unique: false, error: usernameErrors?.join(", ") || "Invalid username" }, { status: 400 });
      }
      UserModel.findOne({ username: result.data.searchParams.username }).then((user) => {
        if (user) {
          return Response.json({ unique: false }, { status: 200 });
        } else {
          return Response.json({ unique: true }, { status: 200 });
        }
      }).catch((dbError) => {
        console.error("Database error:", dbError);
        return Response.json({ unique: false, error: "Database error" }, { status: 500 });
      });
    } catch (error) {
      console.error("Error parsing URL or validating username:", error);
      return Response.json({ unique: false, error: "Invalid username format" }, { status: 400 });

    }
};