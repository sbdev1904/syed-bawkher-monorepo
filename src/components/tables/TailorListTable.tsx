"use client";

import React, { useEffect, useState } from "react";
import tailorService from "../../services/tailorService";
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
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

interface Tailor {
    tailor_id: number;
    first_name: string;
    last_name: string | null;
    specialization: string | null;
    experience_years: number | null;
    joining_date: string;
    address: string | null;
    phone_number: string | null;
    email: string | null;
    emergency_contact: string | null;
    status: string;
    hourly_rate: number | null;
    notes: string | null;
}

const TailorListTable = () => {
    const [tailors, setTailors] = useState<Tailor[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTailor, setSelectedTailor] = useState<Tailor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchTailors = async () => {
        try {
            setIsLoading(true);
            const data = await tailorService.getAllTailors();
            setTailors(data);
        } catch (error) {
            console.error("Error fetching tailors:", error);
            toast({
                title: "Error",
                description: "Failed to fetch tailors",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTailors();
    }, []);

    const handleDelete = async (tailor: Tailor) => {
        setSelectedTailor(tailor);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedTailor) return;

        try {
            await tailorService.deleteTailor(selectedTailor.tailor_id);
            toast({
                title: "Success",
                description: "Tailor deleted successfully",
            });
            fetchTailors();
        } catch (error) {
            console.error("Error deleting tailor:", error);
            toast({
                title: "Error",
                description: "Failed to delete tailor",
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedTailor(null);
        }
    };

    return (
        <>
            <div className="rounded-md border">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Spinner size="lg" container />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-900">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Specialization</TableHead>
                                <TableHead>Experience (Years)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Emergency Contact</TableHead>
                                <TableHead>Hourly Rate</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-slate-800">
                            {tailors.map((tailor) => (
                                <TableRow key={tailor.tailor_id}>
                                    <TableCell>
                                        {tailor.first_name} {tailor.last_name}
                                    </TableCell>
                                    <TableCell>{tailor.specialization}</TableCell>
                                    <TableCell>{tailor.experience_years}</TableCell>
                                    <TableCell>{tailor.status}</TableCell>
                                    <TableCell>{tailor.phone_number}</TableCell>
                                    <TableCell>{tailor.email}</TableCell>
                                    <TableCell>{tailor.emergency_contact}</TableCell>
                                    <TableCell>
                                        {tailor.hourly_rate
                                            ? `$${tailor.hourly_rate.toFixed(2)}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(tailor)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            {selectedTailor
                                ? `${selectedTailor.first_name} ${selectedTailor.last_name}`
                                : "this tailor"}
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TailorListTable; 