import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUrlSafetyResult {
  url: string;
  isSafe: boolean;
  threatType?: string;
  platformType?: string;
  cacheDuration?: string;
  lastChecked: Date;
}

<<<<<<< HEAD
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // Ensures no two users can have the same email
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.models.User || mongoose.model('User', UserSchema);
=======
export interface IEmail {
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  body: string;
  isRead: boolean;
  isPotentialPhishing: boolean;
  phishingScore: number;
  phishingReasons: string[];
  // Enhanced analysis fields
  prediction?: string;
  confidence?: number;
  model_used?: string;
  virusTotalResult?: any;
  googleSafeBrowsingResult?: IUrlSafetyResult[];
  heuristicScore?: number;
  mlScore?: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  emails: IEmail[];
  lastEmailSync?: Date;
}

const UrlSafetyResultSchema = new Schema<IUrlSafetyResult>({
  url: { type: String, required: true },
  isSafe: { type: Boolean, required: true },
  threatType: { type: String },
  platformType: { type: String },
  cacheDuration: { type: String },
  lastChecked: { type: Date, required: true }
});

const EmailSchema = new Schema<IEmail>(
  {
    messageId: { type: String, required: true },
    subject: { type: String, default: "(No Subject)" },
    from: { type: String, required: true, default: "unknown@unknown.com" },
    to: { type: String, default: "unknown@unknown.com" },
    date: { type: Date, required: true },
    body: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    isPotentialPhishing: { type: Boolean, default: false },
    phishingScore: { type: Number, default: 0 },
    phishingReasons: [{ type: String }],
    // Enhanced analysis fields
    prediction: { type: String },
    confidence: { type: Number },
    model_used: { type: String },
    virusTotalResult: { type: Schema.Types.Mixed },
    googleSafeBrowsingResult: [UrlSafetyResultSchema],
    heuristicScore: { type: Number },
    mlScore: { type: Number },
  },
  { timestamps: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    provider: { type: String, enum: ["credentials", "google", "azure-ad", "oauth"], default: "credentials" },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    emails: [EmailSchema],
    lastEmailSync: { type: Date },
  },
  { timestamps: true }
);

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
>>>>>>> 94b66900742252551c618d17a6bedf5d5364d3f4
