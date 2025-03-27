import React, { useEffect, useState } from "react";
import { Table } from "antd";
import jacketService from "../../services/jacketService";
import moment from "moment";

const JacketMeasurements = ({ customerId }) => {
  const [jacketData, setJacketData] = useState([]);

  useEffect(() => {
    const fetchJacketData = async () => {
      try {
        let data = await jacketService.getJacketByCustomerId(customerId);
        // Filter out entries where all measurement fields are null
        data = data.filter((entry) => {
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

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      fixed: "left",
      key: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(), // Sorting by Unix timestamp
      sortDirections: ["descend", "ascend"], // Default sorting directions
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Jacket Length",
      dataIndex: "jacket_length",
      key: "jacket_length",
      render: (text) => text || "N/A",
    },
    {
      title: "Natural Length",
      dataIndex: "natural_length",
      key: "natural_length",
      render: (text) => text || "N/A",
    },
    {
      title: "Back Length",
      dataIndex: "back_length",
      key: "back_length",
      render: (text) => text || "N/A",
    },
    {
      title: "Cross Back",
      dataIndex: "x_back",
      key: "x_back",
      render: (text) => text || "N/A",
    },
    {
      title: "Half Shoulder",
      dataIndex: "half_shoulder",
      key: "half_shoulder",
      render: (text) => text || "N/A",
    },
    {
      title: "To Sleeve",
      dataIndex: "to_sleeve",
      key: "to_sleeve",
      render: (text) => text || "N/A",
    },
    {
      title: "Chest",
      dataIndex: "chest",
      key: "chest",
      render: (text) => text || "N/A",
    },
    {
      title: "Waist",
      dataIndex: "waist",
      key: "waist",
      render: (text) => text || "N/A",
    },
    {
      title: "Collar",
      dataIndex: "collar",
      key: "collar",
      render: (text) => text || "N/A",
    },
    {
      title: "Vest Coat Length",
      dataIndex: "waist_coat_length",
      key: "waist_coat_length",
      render: (text) => text || "N/A",
    },
    {
      title: "Sherwani Length",
      dataIndex: "sherwani_length",
      key: "sherwani_length",
      render: (text) => text || "N/A",
    },
    {
      title: "Other Notes",
      dataIndex: "other_notes",
      key: "other_notes",
      fixed: "right",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-600">Jacket</h1>
      <Table
        className="shadow-lg rounded-lg bg-slate-300"
        dataSource={jacketData}
        scroll={{
          x: 1000,
        }}
        columns={columns}
        rowKey="measurement_id"
      />
    </div>
  );
};

export default JacketMeasurements;
