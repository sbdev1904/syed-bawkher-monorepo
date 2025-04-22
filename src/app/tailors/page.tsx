'use client'

import React, { useCallback, useRef } from "react";
import TailorListTable, { TailorListTableRef } from "@/components/tables/TailorListTable";
import AddTailorButton from "@/components/buttons/AddTailorButton";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TailorDetails = () => {
    const tableRef = useRef<TailorListTableRef>(null);

    const handleRefresh = useCallback(() => {
        tableRef.current?.refresh();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row justify-between mb-5">
                    <div className="text-3xl font-bold">Tailor Management</div>
                    <AddTailorButton onSuccess={handleRefresh} />
                </div>
                <div>
                    <TailorListTable ref={tableRef} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TailorDetails; 