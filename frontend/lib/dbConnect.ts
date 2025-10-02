import mongoose from 'mongoose'


const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined')


let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } =
(global as any)._mongoose || { conn: null, promise: null }


if (!cached.promise) {
cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose)
}


export default async function dbConnect() {
if (cached.conn) return cached.conn
cached.conn = await cached.promise!
;(global as any)._mongoose = cached
return cached.conn
}