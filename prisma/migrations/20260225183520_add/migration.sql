-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_tutorId_fkey";

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
