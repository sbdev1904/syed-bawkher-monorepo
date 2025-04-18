"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import orderService from "@/services/orderService";
import tailorService from "@/services/tailorService";
import tailorAssignmentService from "@/services/tailorAssignmentService";
import productionService from "@/services/productionService";
import { useToast } from "@/components/ui/use-toast";
import type { ProductionStatus } from "@prisma/client";
import JacketCard from "@/components/cards/JacketCard";
import PantCard from "@/components/cards/PantCard";
import ShirtCard from "@/components/cards/ShirtCard";
import OrderPhotoCard from "@/components/cards/OrderPhotoCard";
import ItemsTable from "@/components/tables/ItemsTable";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order {
  orderNo: string;
  note?: string;
  date?: string;
  production?: {
    status: ProductionStatus;
    notes?: string;
  };
}

interface Tailor {
  tailor_id: number;
  first_name: string;
  last_name: string | null;
  specialization: string | null;
  status: string;
}

interface TailorAssignment {
  id: number;
  tailor: Tailor;
  status: string;
  assigned_at: Date;
  due_date: Date | null;
  notes: string | null;
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const orderData = await orderService.getOrder(orderNo);

        // Fetch production status
        const productionData = await productionService.getProductionStatus(orderNo);

        setOrder({
          ...orderData,
          production: productionData,
        });

        // Fetch available tailors
        const tailors = await tailorService.getAllTailors();
        setAvailableTailors(tailors);

        // Fetch assigned tailors
        const assignments = await tailorAssignmentService.getTailorsByOrder(orderNo);
        setAssignedTailors(assignments.map((assignment: TailorAssignment) => ({
          ...assignment,
          assigned_at: new Date(assignment.assigned_at),
          due_date: assignment.due_date ? new Date(assignment.due_date) : null
        })));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [orderNo]);

  const handleInitializeProduction = async () => {
    try {
      const production = await productionService.initializeProduction(orderNo);
      setOrder(prev => prev ? {
        ...prev,
        production,
      } : null);
      toast({
        title: "Success",
        description: "Production tracking initialized successfully!",
      });
    } catch (error) {
      console.error("Failed to initialize production:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize production tracking.",
      });
    }
  };

  const handleUpdateProductionStatus = async (status: ProductionStatus) => {
    try {
      const production = await productionService.updateProductionStatus({
        orderNo,
        status,
      });
      setOrder(prev => prev ? {
        ...prev,
        production,
      } : null);
      toast({
        title: "Success",
        description: "Production status updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update production status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update production status.",
      });
    }
  };

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
      setAssignedTailors(assignments.map((assignment: TailorAssignment) => ({
        ...assignment,
        assigned_at: new Date(assignment.assigned_at),
        due_date: assignment.due_date ? new Date(assignment.due_date) : null
      })));

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
      setAssignedTailors(assignments.map((assignment: TailorAssignment) => ({
        ...assignment,
        assigned_at: new Date(assignment.assigned_at),
        due_date: assignment.due_date ? new Date(assignment.due_date) : null
      })));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRemoveTailor = async (tailorId: number) => {
    try {
      await tailorAssignmentService.removeTailorFromOrder(orderNo, tailorId);

      // Refresh assigned tailors
      const assignments = await tailorAssignmentService.getTailorsByOrder(orderNo);
      setAssignedTailors(assignments.map((assignment: TailorAssignment) => ({
        ...assignment,
        assigned_at: new Date(assignment.assigned_at),
        due_date: assignment.due_date ? new Date(assignment.due_date) : null
      })));
    } catch (error) {
      console.error("Failed to remove tailor:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="text-xl font-bold">Order #{orderNo}</div>

      {/* Production Status Section */}
      <div className="mt-4">
        {!order?.production ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">No production tracking</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInitializeProduction}
            >
              Initialize Production
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm">Production Status:</span>
            <Select
              value={order.production.status}
              onValueChange={(value) => handleUpdateProductionStatus(value as ProductionStatus)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PATTERN_CUTTING_PENDING">Pattern Cutting</SelectItem>
                <SelectItem value="TAILOR_ASSIGNMENT_PENDING">Tailor Assignment</SelectItem>
                <SelectItem value="BASE_SUIT_PRODUCTION">Base Production</SelectItem>
                <SelectItem value="TRIAL_PENDING">Trial Pending</SelectItem>
                <SelectItem value="FINAL_PRODUCTION">Final Production</SelectItem>
                <SelectItem value="FINAL_FITTING_PENDING">Final Fitting</SelectItem>
                <SelectItem value="DELIVERY_PENDING">Delivery Pending</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex flex-row pt-10 space-x-5">
        <JacketCard orderNo={orderNo} />
        <PantCard orderNo={orderNo} />
        <ShirtCard orderNo={orderNo} />
      </div>

      {/* Tailor Assignment Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Assign Tailors</h2>

        {/* Assignment Form */}
        <div className="bg-slate-800 p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-4 gap-4">
            <Select value={selectedTailor?.toString() || ""} onValueChange={(value) => setSelectedTailor(Number(value))}>
              <SelectTrigger className="bg-slate-900 w-full">
                <SelectValue placeholder="Select Tailor" />
              </SelectTrigger>
              <SelectContent>
                {availableTailors.map((tailor) => (
                  <SelectItem key={tailor.tailor_id} value={tailor.tailor_id.toString()}>
                    {tailor.first_name} {tailor.last_name} ({tailor.specialization})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="border rounded p-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Notes"
              className="border rounded p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              variant="outline"
              className="bg-slate-900 text-white rounded px-4 py-2"
              onClick={handleAssignTailor}
            >
              Assign Tailor
            </Button>
          </div>
        </div>

        {/* Assigned Tailors List */}
        <div className="bg-slate-800 rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-900">
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
                    <Select
                      value={assignment.status}
                      onValueChange={(value) => handleUpdateStatus(assignment.tailor.tailor_id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASSIGNED">Assigned</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.assigned_at.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.due_date
                      ? assignment.due_date.toLocaleDateString()
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
        <div className="text-lg font-semibold">Order Notes</div>
        <div className="text-sm text-gray-400">
          {order ? order.note || "No additional notes" : "Loading notes..."}
        </div>
      </div>
      <div className="pt-2">
        <OrderPhotoCard orderNo={orderNo} />
      </div>
      <div className="pt-2">
        <ItemsTable orderNo={orderNo} />
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;
