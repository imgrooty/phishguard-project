-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "external_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailScan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EmailScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");

-- AddForeignKey
ALTER TABLE "EmailScan" ADD CONSTRAINT "EmailScan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
