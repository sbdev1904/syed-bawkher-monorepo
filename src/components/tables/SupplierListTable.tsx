"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supplierService from "../../services/supplierService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Supplier {
  supplier_id: string;
  supplier_name: string;
  add1: string;
  add2: string;
  add3: string;
  phone_number1: string;
  phone_number2: string;
  phone_number3: string;
  email: string;
  primary_contact_name1: string;
  primary_contact_name2: string;
  primary_contact_name3: string;
  notes: string;
}

const SupplierListTable = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const supplierList = await supplierService.getAllSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load suppliers: " + (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [toast]);

  const handleDelete = async (supplier: Supplier) => {
    try {
      await supplierService.deleteSupplier(supplier.supplier_id);
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
      setSuppliers(suppliers.filter((s) => s.supplier_id !== supplier.supplier_id));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete supplier: " + (error as Error).message,
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const handleView = (supplierId: string) => {
    router.push(`/supplier/${supplierId}`);
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier Name</TableHead>
            <TableHead>Address 1</TableHead>
            <TableHead>Address 2</TableHead>
            <TableHead>Address 3</TableHead>
            <TableHead>Phone Number 1</TableHead>
            <TableHead>Phone Number 2</TableHead>
            <TableHead>Phone Number 3</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact Name 1</TableHead>
            <TableHead>Contact Name 2</TableHead>
            <TableHead>Contact Name 3</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.supplier_id}>
              <TableCell>{supplier.supplier_name}</TableCell>
              <TableCell>{supplier.add1}</TableCell>
              <TableCell>{supplier.add2}</TableCell>
              <TableCell>{supplier.add3}</TableCell>
              <TableCell>{supplier.phone_number1}</TableCell>
              <TableCell>{supplier.phone_number2}</TableCell>
              <TableCell>{supplier.phone_number3}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.primary_contact_name1}</TableCell>
              <TableCell>{supplier.primary_contact_name2}</TableCell>
              <TableCell>{supplier.primary_contact_name3}</TableCell>
              <TableCell>{supplier.notes}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleView(supplier.supplier_id)}
                  >
                    View
                  </Button>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    {selectedSupplier && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Supplier</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{selectedSupplier.supplier_name}" from the supplier list?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDeleteDialogOpen(false);
                              setSelectedSupplier(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(selectedSupplier)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierListTable;
