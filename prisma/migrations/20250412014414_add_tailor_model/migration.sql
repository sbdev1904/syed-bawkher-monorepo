-- CreateTable
CREATE TABLE "Tailor" (
    "tailor_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "specialization" TEXT,
    "experience_years" INTEGER,
    "joining_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "emergency_contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "hourly_rate" DECIMAL(10,2),
    "notes" TEXT,

    CONSTRAINT "Tailor_pkey" PRIMARY KEY ("tailor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tailor_email_key" ON "Tailor"("email");
