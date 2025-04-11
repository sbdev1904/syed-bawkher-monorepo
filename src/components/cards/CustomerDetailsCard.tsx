"use client";
import React from "react";
import MergeCustomerButton from "../buttons/MergeCustomerButton";
import { FaMobile, FaEnvelope, FaBuilding, FaHome } from "react-icons/fa";

const CustomerDetailsCard = ({ customer }: {
  customer: {
    office_phone: string | null;
    residential_phone: string | null;
    mobile: string | null;
    email: string | null;
    add1: string | null;
    add2: string | null;
    add3: string | null;
    add4: string | null;
    customer_id: string | number;
  };
}) => {
  return (
    <div className="bg-slate-800 text-slate-300 rounded-xl shadow-lg mt-4 transition-all duration-300 hover:shadow-xl">
      <div className="border-b border-slate-600 px-6 py-4">
        <h2 className="text-xl font-semibold ">Customer Details</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium  uppercase tracking-wider mb-4">Contact Information</h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 group">
              <div className="text-slate-500 w-5">
                <FaBuilding className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm ">Office Phone</div>
                <div className="">{customer.office_phone || 'Not provided'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="text-slate-500 w-5">
                <FaHome className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm ">Residential Phone</div>
                <div className="">{customer.residential_phone || 'Not provided'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="text-slate-500 w-5">
                <FaMobile className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm ">Mobile</div>
                <div className="">{customer.mobile || 'Not provided'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="text-slate-500 w-5">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm ">Email</div>
                <div className="">{customer.email || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium  uppercase tracking-wider mb-4">Address Details</h3>

          <div className="space-y-3">
            {[
              { label: 'Address Line 1', value: customer.add1 },
              { label: 'Address Line 2', value: customer.add2 },
              { label: 'Address Line 3', value: customer.add3 },
              { label: 'Address Line 4', value: customer.add4 },
            ].map((address, index) => (
              <div key={index} className="group">
                <div className="text-sm ">{address.label}</div>
                <div className="mt-1">{address.value || 'Not provided'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-end">
          <MergeCustomerButton customer_id={String(customer.customer_id)} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsCard;
