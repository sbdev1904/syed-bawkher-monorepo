"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import fabricService from "../../services/fabricService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Fabric {
  fabric_id: number;
  fabric_code: string;
  description: string;
  available_length: string;
  fabric_brand: string;
  stock_location: string;
  key?: string;
}

export interface TextileTableRef {
  refreshData: () => Promise<void>;
}

const TextileTable = forwardRef<TextileTableRef>((_, ref) => {
  const [data, setData] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const refreshData = async () => {
    setLoading(true);
    try {
      const fabrics = await fabricService.getAllFabrics();
      setData(
        fabrics.map((fabric: Fabric, index: number) => ({
          ...fabric,
          key: index.toString(),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch fabrics:", error);
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    refreshData
  }));

  useEffect(() => {
    refreshData();
  }, []);

  const handleView = (fabricId: number) => {
    router.push(`/fabric/${fabricId}`);
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    if (searchQuery) {
      try {
        const results = await fabricService.searchFabrics(searchQuery);
        setData(
          results.map((fabric: Fabric, index: number) => ({
            ...fabric,
            key: index.toString(),
          }))
        );
      } catch (error) {
        console.error("Failed to search fabrics:", error);
      }
    } else {
      // If search query is empty, fetch all fabrics
      await refreshData();
    }
    setSearchLoading(false);
  };

  return (
    <div>
      <div className="flex mb-4">
        <div className="relative flex-1 bg-slate-900 rounded-md">
          <Input
            placeholder="Search fabrics"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 "
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9"
            onClick={handleSearch}
            disabled={searchLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="bg-slate-800 rounded-md shadow-lg min-w-[1300px]">
          <TableHeader>
            <TableRow>
              <TableHead>Fabric Id</TableHead>
              <TableHead>Fabric Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Available Length</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Stock Location</TableHead>
              <TableHead>Operation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-100"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No fabrics found
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.key || record.fabric_id}>
                  <TableCell>{record.fabric_id}</TableCell>
                  <TableCell>{record.fabric_code}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.available_length}</TableCell>
                  <TableCell>{record.fabric_brand}</TableCell>
                  <TableCell>{record.stock_location}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleView(record.fabric_id)}
                      className="p-3 text-white bg-slate-900"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

TextileTable.displayName = 'TextileTable';

export default TextileTable;
