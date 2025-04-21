-- Step 1: Add new columns as nullable
ALTER TABLE "Bunch" ADD COLUMN "rack_id" INTEGER;
ALTER TABLE "Rack" ADD COLUMN "current_utilization" INTEGER;
ALTER TABLE "Rack" ADD COLUMN "location_id" INTEGER;
ALTER TABLE "Unit" ADD COLUMN "conversion_rate" DOUBLE PRECISION;

-- Step 2: Copy data from old columns to new columns
UPDATE "Bunch" SET 
    "rack_id" = "rackId";

UPDATE "Rack" SET 
    "current_utilization" = "currentUtilization",
    "location_id" = "locationId";


UPDATE "Unit" SET 
    "conversion_rate" = "conversionRate";

-- Step 3: Make new columns required and set defaults where needed
ALTER TABLE "Bunch" 
    ALTER COLUMN "rack_id" SET NOT NULL;

ALTER TABLE "Rack" 
    ALTER COLUMN "current_utilization" SET NOT NULL,
    ALTER COLUMN "current_utilization" SET DEFAULT 0,
    ALTER COLUMN "location_id" SET NOT NULL;



-- Step 4: Drop old columns

ALTER TABLE "Bunch" DROP COLUMN "rackId";
ALTER TABLE "Rack" DROP COLUMN "currentUtilization";
ALTER TABLE "Rack" DROP COLUMN "locationId";
ALTER TABLE "Unit" DROP COLUMN "conversionRate";

-- Step 5: Update foreign key constraints
ALTER TABLE "Bunch" DROP CONSTRAINT IF EXISTS "Bunch_rackId_fkey";
ALTER TABLE "Rack" DROP CONSTRAINT IF EXISTS "Rack_locationId_fkey";
