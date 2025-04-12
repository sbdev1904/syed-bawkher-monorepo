"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import orderService from "@/services/orderService";
import tailorService from "@/services/tailorService";
import tailorAssignmentService from "@/services/tailorAssignmentService";
import JacketCard from "@/components/cards/JacketCard";
import PantCard from "@/components/cards/PantCard";
import ShirtCard from "@/components/cards/ShirtCard";
import OrderPhotoCard from "@/components/cards/OrderPhotoCard";
import ItemsTable from "@/components/tables/ItemsTable";

interface Order {
  orderNo: string;
  note?: string;
  date?: string;
}

interface Tailor {
  tailor_id: number;
  first_name: string;
  last_name?: string;
  specialization?: string;
  status: string;
}

interface TailorAssignment {
  id: number;
  tailor: Tailor;
  status: string;
  assigned_at: string;
  due_date?: string;
  notes?: string;
}

const OrderDetails = () => {
  const pathname = usePathname();
  const orderNo = pathname.split("/")[2];
  const [order, setOrder] = useState<Order | null>(null);
  const [availableTailors, setAvailableTailors] = useState<Tailor[]>([]);
  const [assignedTailors, setAssignedTailors] = useState<TailorAssignment[]>([]);
  const [selectedTailor, setSelectedTailor] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const orderData = await orderService.getOrder(orderNo);
        setOrder(orderData);

        // Fetch available tailors
        const tailors = await tailorService.getActiveTailors();
        setAvailableTailors(tailors);

        // Fetch assigned tailors
        const assignments = await tailorAssignmentService.getTailorsByOrder(orderNo);
        setAssignedTailors(assignments);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [orderNo]);

  const handleAssignTailor = async () => {
    if (!selectedTailor) return;

    try {
      await tailorAssignmentService.assignTailorToOrder({
        orderNo,
        tailorId: selectedTailor,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
      });

      // Refresh assigned tailors
      const assignments = await tailorAssignmentService.getTailorsByOrder(orderNo);
      setAssignedTailors(assignments);

      // Reset form
      setSelectedTailor(null);
      setDueDate("");
      setNotes("");
    } catch (error) {
      console.error("Failed to assign tailor:", error);
    }
  };

  const handleUpdateStatus = async (tailorId: number, status: string) => {
    try {
      await tailorAssignmentService.updateAssignmentStatus({
        orderNo,
        tailorId,
        status: status as "ASSIGNED" | "IN_PROGRESS" | "COMPLETED",
      });

      // Refresh assigned tailors
      const assignments = await tailorAssignmentService.getTailorsByOrder(orderNo);
      setAssignedTailors(assignments);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRemoveTailor = async (tailorId: number) => {
    try {
      await tailorAssignmentService.removeTailorFromOrder(orderNo, tailorId);

      // Refresh assigned tailors
      const assignments = await tailorAssignmentService.getTailorsByOrder(orderNo);
      setAssignedTailors(assignments);
    } catch (error) {
      console.error("Failed to remove tailor:", error);
    }
  };

  return (
    <>
      <div className="text-xl font-bold">{orderNo}</div>
      <div className="flex flex-row pt-10 space-x-5">
        <JacketCard orderNo={orderNo} />
        <PantCard orderNo={orderNo} />
        <ShirtCard orderNo={orderNo} />
      </div>

      {/* Tailor Assignment Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Assign Tailors</h2>

        {/* Assignment Form */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-4 gap-4">
            <select
              className="border rounded p-2"
              value={selectedTailor || ""}
              onChange={(e) => setSelectedTailor(Number(e.target.value))}
            >
              <option value="">Select Tailor</option>
              {availableTailors.map((tailor) => (
                <option key={tailor.tailor_id} value={tailor.tailor_id}>
                  {tailor.first_name} {tailor.last_name} ({tailor.specialization})
                </option>
              ))}
            </select>
            <input
              type="date"
              className="border rounded p-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Notes"
              className="border rounded p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white rounded px-4 py-2"
              onClick={handleAssignTailor}
            >
              Assign Tailor
            </button>
          </div>
        </div>

        {/* Assigned Tailors List */}
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tailor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignedTailors.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.tailor.first_name} {assignment.tailor.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="border rounded p-1"
                      value={assignment.status}
                      onChange={(e) =>
                        handleUpdateStatus(assignment.tailor.tailor_id, e.target.value)
                      }
                    >
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(assignment.assigned_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleRemoveTailor(assignment.tailor.tailor_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-10">
        <div>Order Notes</div>
        <div>
          {order ? order.note || "No additional notes" : "Loading notes..."}
        </div>
      </div>
      <div className="pt-2">
        <OrderPhotoCard orderNo={orderNo} />
      </div>
      <div className="pt-2">
        <ItemsTable orderNo={orderNo} />
      </div>
    </>
  );
};

export default OrderDetails;
