import Image from "next/image";
import React from "react";
import FindCustomer from "@/app/components/search/FindCustomer";
import CreateCustomerButton from "@/app/components/buttons/CreateCustomerButton";
import FindCustomerByOrderNo from "@/app/components/search/FindCustomerByOrderNo";

import { LoginButton, LogoutButton } from "./auth";

export default function Home() {
  return (
    <div className="flex justify-center mt-[80px]">
      <div className="flex flex-col">
        <h1 className="font-bold text-3xl">Find Customer</h1>
        <div className="flex flex-row pt-2 space-x-5">
          <div className="w-[500px]">
            <FindCustomer />
          </div>
          <div className="w-[500px]">
            <FindCustomerByOrderNo />
          </div>
          <CreateCustomerButton />
        </div>
      </div>
    </div>
  );
}
