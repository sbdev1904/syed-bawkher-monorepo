'use client'

import React from "react";
import TailorListTable from "@/components/tables/TailorListTable";
import AddTailorButton from "@/components/buttons/AddTailorButton";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TailorDetails = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-2">
                <div className="">
                    <div className="text-3xl font-bold">Tailor Management</div>
                </div>
                <div className="flex flex-row space-x-2">
                    <AddTailorButton />
                </div>
                <div>
                    <TailorListTable />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TailorDetails; 