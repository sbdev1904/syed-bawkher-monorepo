"use client";
import React, { useEffect, useState } from "react";
import shirtService from '../../services/shirtService'
import moment from 'moment';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ShirtMeasurement {
    measurement_id: string;
    date: string;
    length: string | null;
    half_shoulder: string | null;
    to_sleeve: string | null;
    chest: string | null;
    waist: string | null;
    collar: string | null;
    other_notes: string | null;
}

const ShirtMeasurements = ({ customerId }: { customerId: string }) => {
    const [shirtData, setShirtData] = useState<ShirtMeasurement[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'ascend' | 'descend';
    }>({
        key: 'date',
        direction: 'descend',
    });

    useEffect(() => {
        const fetchShirtData = async () => {
            try {
                let data = await shirtService.getShirtByCustomerId(customerId);
                // Filter data to remove rows with all null measurements
                data = data.filter((entry: ShirtMeasurement) => {
                    const { length, half_shoulder, to_sleeve, chest, waist, collar, other_notes } = entry;
                    return [length, half_shoulder, to_sleeve, chest, waist, collar, other_notes].some(val => val !== null);
                });
                setShirtData(data);
            } catch (error) {
                console.error('Failed to fetch shirt measurements:', error);
            }
        };

        if (customerId) {
            fetchShirtData();
        }
    }, [customerId]);

    // Sort function
    const sortedData = [...shirtData].sort((a, b) => {
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
        <>
            <h1 className="text-lg font-bold text-gray-600">Shirt</h1>
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
                            <TableHead>Half Shoulder</TableHead>
                            <TableHead>To Sleeve</TableHead>
                            <TableHead>Chest</TableHead>
                            <TableHead>Waist</TableHead>
                            <TableHead>Collar</TableHead>
                            <TableHead>Other Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((measurement) => (
                            <TableRow key={measurement.measurement_id}>
                                <TableCell>{moment(measurement.date).format("YYYY-MM-DD")}</TableCell>
                                <TableCell>{measurement.length || "N/A"}</TableCell>
                                <TableCell>{measurement.half_shoulder || "N/A"}</TableCell>
                                <TableCell>{measurement.to_sleeve || "N/A"}</TableCell>
                                <TableCell>{measurement.chest || "N/A"}</TableCell>
                                <TableCell>{measurement.waist || "N/A"}</TableCell>
                                <TableCell>{measurement.collar || "N/A"}</TableCell>
                                <TableCell>{measurement.other_notes || "N/A"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default ShirtMeasurements