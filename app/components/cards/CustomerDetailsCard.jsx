"use client";
import React from "react";
import MergeCustomerButton from "../buttons/MergeCustomerButton";

const CustomerDetailsCard = ({ customer }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg mt-2">
        <div className="flex flex-row justify-between text-black px-4 pt-2 pb-3">
          <div className="pt-2">
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Office:</div>
              <div>{customer.office_phone}</div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Residential:</div>
              <div>{customer.residential_phone}</div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Mobile:</div>
              <div>{customer.mobile}</div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Email:</div>
              <div>{customer.email}</div>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Address 1:</div>
              <div>{customer.add1}</div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Address 2:</div>
              <div>{customer.add2}</div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Address 3:</div>
              <div>{customer.add3}</div>
            </div>
            <div className="flex flex-row space-x-2">
              <div className="font-semibold">Address 4:</div>
              <div>{customer.add4}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <div className="p-2">
            <MergeCustomerButton customer_id={customer.customer_id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailsCard;
