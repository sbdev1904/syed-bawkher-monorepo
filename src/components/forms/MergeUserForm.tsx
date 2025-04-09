"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import customerService from "../../services/customerService";

interface MergeUserFormProps {
  targetCustomerID: string | null;
}

interface CustomerUser {
  customer_id: string;
  full_name: string;
}

interface CustomerSearchResult {
  customer_id: string;
  first_name: string;
  last_name: string;
}

const MergeUserForm = ({ targetCustomerID = null }: MergeUserFormProps) => {
  const [targetUserId, setTargetUserId] = useState<string | null>(targetCustomerID);
  const [otherUserIds, setOtherUserIds] = useState<CustomerUser[]>([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  // Update targetUserId when targetCustomerID prop changes
  useEffect(() => {
    setTargetUserId(targetCustomerID);
  }, [targetCustomerID]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await customerService.searchCustomers(query);
      setSearchResults(
        results.filter((customer: CustomerSearchResult) => customer.customer_id !== targetCustomerID)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Error searching for customers",
        variant: "destructive"
      });
      console.error("Error searching for customers:", error);
    }
  };

  const handleAddUserId = (user: CustomerSearchResult) => {
    const userId = user.customer_id;
    const userName = `${user.first_name} ${user.last_name}`;
    if (userId && !otherUserIds.some((u) => u.customer_id === userId)) {
      setOtherUserIds([
        ...otherUserIds,
        { customer_id: userId, full_name: userName },
      ]);
    }
  };

  const handleRemoveUserId = (userId: string) => {
    setOtherUserIds(otherUserIds.filter((user) => user.customer_id !== userId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchUserId(query);
    handleSearch(query);
  };

  const handleMerge = async () => {
    const customerIds = [
      targetUserId,
      ...otherUserIds.map((u) => u.customer_id),
    ].filter(Boolean) as string[];

    try {
      await customerService.mergeCustomers(customerIds);
      toast({
        title: "Success",
        description: "Customers merged successfully"
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge customers",
        variant: "destructive"
      });
      console.error("Error merging customers:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <FormLabel>Target User ID</FormLabel>
        <Input
          value={targetUserId || ""}
          onChange={(e) => setTargetUserId(e.target.value)}
          disabled={!!targetCustomerID} // Disable input if targetCustomerID is provided
        />
      </div>

      <div className="space-y-2">
        <FormLabel>Search and Add User ID to Merge</FormLabel>
        <Input value={searchUserId} onChange={handleInputChange} />

        {searchResults.length > 0 && (
          <div className="rounded-md border border-gray-200 mt-2">
            {searchResults.map(item => (
              <div
                key={item.customer_id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => handleAddUserId(item)}
              >
                {`${item.customer_id} - ${item.first_name} ${item.last_name}`}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <FormLabel>Users to Merge</FormLabel>
        <div className="rounded-md border border-gray-200">
          {otherUserIds.length > 0 ? (
            otherUserIds.map((item) => (
              <div
                key={item.customer_id}
                className="p-2 border-b last:border-0 flex items-center justify-between"
              >
                <span>{`${item.customer_id} - ${item.full_name}`}</span>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveUserId(item.customer_id)}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-500">No users selected to merge</p>
          )}
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogTrigger asChild>
          <Button type="button" disabled={!targetUserId || otherUserIds.length === 0}>
            Merge Users
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Merge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to merge these users? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMerge}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MergeUserForm;
