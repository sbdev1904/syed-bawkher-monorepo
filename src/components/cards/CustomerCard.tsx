"use client";
import React from "react";
import { useRouter } from "next/navigation";

const CustomerCard = ({
  fName,
  mName,
  lName,
  phOff,
  phRes,
  mobile,
  email,
  customer_id,
}: {
  fName: string;
  mName: string;
  lName: string;
  phOff: string;
  phRes: string;
  mobile: string;
  email: string;
  customer_id: number;
}) => {
  const router = useRouter();

  const fullName = [fName, mName, lName]
    .filter((name) => name && name !== "NULL") // Check for non-null and not "NULL"
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()) // Capitalize names
    .join(" ");

  // Function to handle click on the card
  const handleCardClick = () => {
    router.push(`/customer/${customer_id}`); // Navigate to customer details
  };

  return (
    <div
      className="sm:w-full bg-slate-800 md:p-2 rounded-lg shadow-sm hover:bg-slate-700 cursor-pointer snap-start"
      onClick={handleCardClick} // Set onClick handler
    >
      <div className="font-bold">
        {customer_id + ": " + (fullName || "Unnamed")}
      </div>
      <div className="flex justify-between text-sm">
        {phOff && (
          <div className="flex">
            <div className="hidden md:block">Office:</div>
            <div>{phOff}</div>
          </div>
        )}
        {phRes && (
          <div className="flex">
            <div className="hidden md:block">Residential:</div>
            <div>{phRes}</div>
          </div>
        )}
        {mobile && (
          <div className="flex">
            <div className="hidden md:block">Mobile:</div>
            <div>{mobile}</div>
          </div>
        )}
        {email && (
          <div className="flex">
            <div className="hidden md:block">Email:</div>
            <div>{email}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
