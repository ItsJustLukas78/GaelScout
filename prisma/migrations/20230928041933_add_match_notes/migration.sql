-- CreateTable
CREATE TABLE "TeamNote" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "note" JSONB NOT NULL,

    CONSTRAINT "TeamNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamNote" ADD CONSTRAINT "TeamNote_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "TeamProfile"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
