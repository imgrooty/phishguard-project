// // pages/api/save-user.js
// import { currentUser } from "@clerk/nextjs/server";
// import connectToDB from "@/lib/dbConnect";
// import User from "@/models/User";

// export default async function handler(req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; end: { (): any; new(): any; }; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
//   if (req.method !== "POST") return res.status(405).end();

//   const user = await currentUser();
//   if (!user) return res.status(401).json({ message: "Not authenticated" });

//   await connectToDB();

//   // Check if user already exists
//   let existingUser = await User.findOne({ clerkId: user.id });
//   if (!existingUser) {
//     existingUser = await User.create({
//       clerkId: user.id,
//       email: user.emailAddresses[0].emailAddress,
//       username: user.username || "",
//     });
//   }

//   res.status(200).json(existingUser);
// }
