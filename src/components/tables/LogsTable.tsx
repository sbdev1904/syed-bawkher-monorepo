"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface LogEntry {
  id: number;
  action: string;
  timestamp: string;
}

interface LogsTableProps {
  initialLogs: LogEntry[];
}

const LogsTable: React.FC<LogsTableProps> = ({ initialLogs = [] }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined } as DateRange,
    searchText: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const filterLogs = () => {
    let filteredData = [...initialLogs];

    // Filter by date range
    if (filters.dateRange.from && filters.dateRange.to) {
      filteredData = filteredData.filter((log) => {
        const logDate = new Date(log.timestamp).valueOf();
        return (
          logDate >= filters.dateRange.from!.valueOf() &&
          logDate <= filters.dateRange.to!.valueOf()
        );
      });
    }

    // Filter by search text
    if (filters.searchText) {
      filteredData = filteredData.filter((log) =>
        log.action.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    setLogs(filteredData);
  };

  useEffect(() => {
    filterLogs();
  }, [filters, initialLogs]);

  // Pagination logic
  const totalPages = Math.ceil(logs.length / pagination.pageSize);
  const paginatedLogs = logs.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !filters.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "PPP")} -{" "}
                      {format(filters.dateRange.to, "PPP")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "PPP")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={{
                  from: filters.dateRange.from,
                  to: filters.dateRange.to,
                }}
                onSelect={(range) => {
                  setFilters({
                    ...filters,
                    dateRange: {
                      from: range?.from,
                      to: range?.to,
                    },
                  });
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={filters.searchText}
            onChange={(e) =>
              setFilters({ ...filters, searchText: e.target.value })
            }
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-6">
                  No logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {logs.length > pagination.pageSize && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (pagination.currentPage > 1) {
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage - 1,
                    });
                  }
                }}
                aria-disabled={pagination.currentPage === 1}
                className={
                  pagination.currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setPagination({
                        ...pagination,
                        currentPage: pageNum,
                      });
                    }}
                    isActive={pagination.currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setPagination({
                        ...pagination,
                        currentPage: totalPages,
                      });
                    }}
                    isActive={pagination.currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (pagination.currentPage < totalPages) {
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage + 1,
                    });
                  }
                }}
                aria-disabled={pagination.currentPage === totalPages}
                className={
                  pagination.currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default LogsTable;
