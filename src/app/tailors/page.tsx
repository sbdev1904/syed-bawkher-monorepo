'use client'

import React from "react";
import TailorListTable from "@/components/tables/TailorListTable";
import AddTailorButton from "@/components/buttons/AddTailorButton";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TailorDetails = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row justify-between mb-5">
                    <div className="text-3xl font-bold">Tailor Management</div>
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