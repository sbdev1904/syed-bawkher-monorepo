"use client";
import React, { useEffect, useState } from "react";
import pantService from "../../services/pantService";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PantMeasurement {
  measurement_id: string;
  date: string;
  length: string | null;
  inseem: string | null;
  waist: string | null;
  hips: string | null;
  bottom: string | null;
  knee: string | null;
  other_notes: string | null;
}

const PantMeasurements = ({ customerId }: { customerId: string }) => {
  const [pantData, setPantData] = useState<PantMeasurement[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascend' | 'descend';
  }>({
    key: 'date',
    direction: 'descend',
  });

  useEffect(() => {
    const fetchPantData = async () => {
      try {
        let data = await pantService.getPantByCustomerId(customerId);
        // Filter data to remove rows with all null measurements
        data = data.filter((entry: PantMeasurement) => {
          const { length, inseem, waist, hips, bottom, knee, other_notes } =
            entry;
          return [length, inseem, waist, hips, bottom, knee, other_notes].some(
            (val) => val !== null
          );
        });
        setPantData(data);
      } catch (error) {
        console.error("Failed to fetch pant measurements:", error);
      }
    };

    if (customerId) {
      fetchPantData();
    }
  }, [customerId]);

  // Sort function
  const sortedData = [...pantData].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const comparison = moment(a.date).unix() - moment(b.date).unix();
      return sortConfig.direction === 'ascend' ? comparison : -comparison;
    }
    return 0;
  });

  // Toggle sort direction
  const handleSort = () => {
    setSortConfig({
      key: 'date',
      direction: sortConfig.direction === 'ascend' ? 'descend' : 'ascend',
    });
  };

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-600">Trouser</h1>
      <div className="overflow-x-auto">
        <Table className="shadow-lg rounded-lg bg-slate-300 min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={handleSort}
              >
                Date {sortConfig.direction === 'ascend' ? '↑' : '↓'}
              </TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Inseem</TableHead>
              <TableHead>Waist</TableHead>
              <TableHead>Hips</TableHead>
              <TableHead>Bottom</TableHead>
              <TableHead>Knee</TableHead>
              <TableHead>Other Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((measurement) => (
              <TableRow key={measurement.measurement_id}>
                <TableCell>{moment(measurement.date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{measurement.length || "N/A"}</TableCell>
                <TableCell>{measurement.inseem || "N/A"}</TableCell>
                <TableCell>{measurement.waist || "N/A"}</TableCell>
                <TableCell>{measurement.hips || "N/A"}</TableCell>
                <TableCell>{measurement.bottom || "N/A"}</TableCell>
                <TableCell>{measurement.knee || "N/A"}</TableCell>
                <TableCell>{measurement.other_notes || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PantMeasurements;
