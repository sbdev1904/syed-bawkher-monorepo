"use client";

import React, { useState, useEffect } from "react";
import { Table, DatePicker, Select, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RangePickerProps } from "antd/es/date-picker";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import LogDetailsModal from "../modals/LogDetailsModal";
import type { LogEntry } from "@/lib/logs";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LogsTableProps {
  initialLogs: LogEntry[];
}

const LogsTable: React.FC<LogsTableProps> = ({ initialLogs = [] }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: null as Parameters<Required<RangePickerProps>["onChange"]>[0],
    searchText: "",
  });

  const filterLogs = () => {
    let filteredData = [...initialLogs];

    // Filter by date range
    if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
      const [startDate, endDate] = filters.dateRange;
      filteredData = filteredData.filter((log) => {
        const logDate = new Date(log.timestamp).valueOf();
        return logDate >= startDate.valueOf() && logDate <= endDate.valueOf();
      });
    }

    // Filter by type
    if (filters.type !== "all") {
      filteredData = filteredData.filter((log) => log.type === filters.type);
    }

    // Filter by search text
    if (filters.searchText) {
      filteredData = filteredData.filter(
        (log) =>
          log.description
            .toLowerCase()
            .includes(filters.searchText.toLowerCase()) ||
          log.user.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    setLogs(filteredData);
  };

  useEffect(() => {
    filterLogs();
  }, [filters]);

  const handleViewDetails = (record: LogEntry) => {
    setSelectedLog(record);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<LogEntry> = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a: LogEntry, b: LogEntry) =>
        new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf(),
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Order", value: "order" },
        { text: "Inventory", value: "inventory" },
        { text: "Status", value: "status" },
      ],
      onFilter: (value: any, record: LogEntry) => record.type === value,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Details",
      key: "details",
      render: (_: any, record: LogEntry) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value })}
            style={{ width: 200 }}
          >
            <Option value="all">All Types</Option>
            <Option value="order">Order Actions</Option>
            <Option value="inventory">Inventory Actions</Option>
            <Option value="status">Status Changes</Option>
          </Select>

          <RangePicker
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            style={{ width: 300 }}
          />

          <Input
            placeholder="Search logs..."
            prefix={<SearchOutlined />}
            onChange={(e) =>
              setFilters({ ...filters, searchText: e.target.value })
            }
            style={{ width: 200 }}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={() => filterLogs()}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={logs}
          loading={loading}
          rowKey={(record) => record.id}
          className="bg-white rounded-lg shadow"
          scroll={{ x: true }}
          pagination={{
            total: logs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>

      <LogDetailsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        logData={selectedLog}
      />
    </>
  );
};

export default LogsTable;
