"use client";
import React, { useEffect, useState } from "react";
import jacketService from "../../services/jacketService";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JacketMeasurement {
  measurement_id: string;
  date: string;
  jacket_length: string | null;
  natural_length: string | null;
  back_length: string | null;
  x_back: string | null;
  half_shoulder: string | null;
  to_sleeve: string | null;
  chest: string | null;
  waist: string | null;
  collar: string | null;
  waist_coat_length: string | null;
  sherwani_length: string | null;
  other_notes: string | null;
}

const JacketMeasurements = ({ customerId }: { customerId: string }) => {
  const [jacketData, setJacketData] = useState<JacketMeasurement[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascend' | 'descend';
  }>({
    key: 'date',
    direction: 'descend',
  });

  useEffect(() => {
    const fetchJacketData = async () => {
      try {
        let data = await jacketService.getJacketByCustomerId(customerId);
        // Filter out entries where all measurement fields are null
        data = data.filter((entry: JacketMeasurement) => {
          const {
            jacket_length,
            natural_length,
            back_length,
            x_back,
            half_shoulder,
            to_sleeve,
            chest,
            waist,
            collar,
            waist_coat_length,
            sherwani_length,
          } = entry;
          return [
            jacket_length,
            natural_length,
            back_length,
            x_back,
            half_shoulder,
            to_sleeve,
            chest,
            waist,
            collar,
            waist_coat_length,
            sherwani_length,
          ].some((val) => val !== null);
        });
        setJacketData(data);
      } catch (error) {
        console.error("Failed to fetch jacket measurements:", error);
      }
    };

    if (customerId) {
      fetchJacketData();
    }
  }, [customerId]);

  // Sort function
  const sortedData = [...jacketData].sort((a, b) => {
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
      <h1 className="text-lg font-bold text-gray-600">Jacket</h1>
      <div className="overflow-x-auto">
        <Table className="shadow-lg rounded-lg bg-slate-300 min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={handleSort}
              >
                Date {sortConfig.direction === 'ascend' ? '↑' : '↓'}
              </TableHead>
              <TableHead>Jacket Length</TableHead>
              <TableHead>Natural Length</TableHead>
              <TableHead>Back Length</TableHead>
              <TableHead>Cross Back</TableHead>
              <TableHead>Half Shoulder</TableHead>
              <TableHead>To Sleeve</TableHead>
              <TableHead>Chest</TableHead>
              <TableHead>Waist</TableHead>
              <TableHead>Collar</TableHead>
              <TableHead>Vest Coat Length</TableHead>
              <TableHead>Sherwani Length</TableHead>
              <TableHead>Other Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((measurement) => (
              <TableRow key={measurement.measurement_id}>
                <TableCell>{moment(measurement.date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{measurement.jacket_length || "N/A"}</TableCell>
                <TableCell>{measurement.natural_length || "N/A"}</TableCell>
                <TableCell>{measurement.back_length || "N/A"}</TableCell>
                <TableCell>{measurement.x_back || "N/A"}</TableCell>
                <TableCell>{measurement.half_shoulder || "N/A"}</TableCell>
                <TableCell>{measurement.to_sleeve || "N/A"}</TableCell>
                <TableCell>{measurement.chest || "N/A"}</TableCell>
                <TableCell>{measurement.waist || "N/A"}</TableCell>
                <TableCell>{measurement.collar || "N/A"}</TableCell>
                <TableCell>{measurement.waist_coat_length || "N/A"}</TableCell>
                <TableCell>{measurement.sherwani_length || "N/A"}</TableCell>
                <TableCell>{measurement.other_notes || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JacketMeasurements;
