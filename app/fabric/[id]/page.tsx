"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fabricService from "../../services/fabricService";
import FabricCard from "../../components/cards/FabricCard";
import FabricOrderListTable from "../../components/tables/FabricOrderListTable";
import { usePathname } from "next/navigation";

const FabricDetails = () => {
  const pathname = usePathname();
  const fabricId = pathname.split("/")[2];
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFabric = async () => {
      try {
        const fabricData = await fabricService.getFabricById(fabricId);
        setFabric(fabricData);
      } catch (error) {
        setError("Failed to fetch fabric details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFabric();
  }, [fabricId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="text-xl font-bold">Fabric Details</div>
      <div className="py-2">{fabric && <FabricCard fabric={fabric} />}</div>
      <div>
        <FabricOrderListTable fabricId={fabricId} />
      </div>
    </>
  );
};

export default FabricDetails;
