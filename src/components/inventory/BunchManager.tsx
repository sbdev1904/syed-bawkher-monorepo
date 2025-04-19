"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bunch, InventoryItem, Rack } from "@/services/locationService";
import bunchService from "@/services/bunchService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Package, Plus, Trash2 } from "lucide-react";

interface BunchManagerProps {
  rack: Rack;
  onUpdate: () => void;
}

export default function BunchManager({ rack, onUpdate }: BunchManagerProps) {
  const { toast } = useToast();
  const [isAddBunchOpen, setIsAddBunchOpen] = useState(false);
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);
  const [selectedBunch, setSelectedBunch] = useState<Bunch | null>(null);
  const [newBunchData, setNewBunchData] = useState({
    name: "",
    description: "",
  });
  const [newItemData, setNewItemData] = useState({
    name: "",
    type: "",
    quantity: 0,
    unit: "",
  });

  console.log(isAddItemsOpen);
  console.log(newItemData);
  // Fetch bunches for the rack
  const {
    data: bunches,
    isLoading,
    refetch: refetchBunches,
  } = useQuery({
    queryKey: ["bunches", rack.id],
    queryFn: () => bunchService.getBunchesByRack(rack.id),
  });

  const handleAddBunch = async () => {
    try {
      await bunchService.createBunch({
        ...newBunchData,
        rack_id: rack.id,
      });
      toast({
        title: "Success",
        description: "Bunch created successfully",
      });
      setIsAddBunchOpen(false);
      setNewBunchData({ name: "", description: "" });
      refetchBunches();
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create bunch: ${error}`,
      });
    }
  };

  const handleAddItem = async () => {
    if (!selectedBunch) return;
    try {
      await bunchService.addItemsToBunch(selectedBunch.id, [newItemData]);
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      setIsAddItemsOpen(false);
      setNewItemData({ name: "", type: "", quantity: 0, unit: "" });
      refetchBunches();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add item: ${error}`,
      });
    }
  };

  const handleDeleteItem = async (bunch_id: number, item_id: number) => {
    try {
      await bunchService.addItemsToBunch(bunch_id, [{ id: item_id }]);
      toast({
        title: "Success",
        description: "Item removed successfully",
      });
      refetchBunches();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to remove item: ${error}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bunches in {rack.name}</h2>
        <Dialog open={isAddBunchOpen} onOpenChange={setIsAddBunchOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bunch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bunch</DialogTitle>
              <DialogDescription>
                Create a new bunch in {rack.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newBunchData.name}
                  onChange={(e) =>
                    setNewBunchData({ ...newBunchData, name: e.target.value })
                  }
                  placeholder="Enter bunch name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBunchData.description}
                  onChange={(e) =>
                    setNewBunchData({
                      ...newBunchData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter bunch description"
                />
              </div>
            </div>
            <Button onClick={handleAddBunch}>Create Bunch</Button>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading bunches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bunches?.map((bunch: Bunch) => (
            <Card key={bunch.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    <CardTitle>{bunch.name}</CardTitle>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedBunch(bunch);
                          setIsAddItemsOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>
                          Add a new item to {bunch.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="itemName">Name</Label>
                          <Input
                            id="itemName"
                            value={newItemData.name}
                            onChange={(e) =>
                              setNewItemData({
                                ...newItemData,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter item name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="itemType">Type</Label>
                          <Select
                            value={newItemData.type}
                            onValueChange={(value) =>
                              setNewItemData({ ...newItemData, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fabric">Fabric</SelectItem>
                              <SelectItem value="accessory">
                                Accessory
                              </SelectItem>
                              <SelectItem value="packaging">
                                Packaging
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={newItemData.quantity}
                            onChange={(e) =>
                              setNewItemData({
                                ...newItemData,
                                quantity: parseInt(e.target.value),
                              })
                            }
                            placeholder="Enter quantity"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="unit">Unit</Label>
                          <Select
                            value={newItemData.unit}
                            onValueChange={(value) =>
                              setNewItemData({ ...newItemData, unit: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meters">Meters</SelectItem>
                              <SelectItem value="pieces">Pieces</SelectItem>
                              <SelectItem value="rolls">Rolls</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleAddItem}>Add Item</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bunch.items.map((item: InventoryItem) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit} - {item.type}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(bunch.id, item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
