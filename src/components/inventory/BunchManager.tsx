"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bunch, Rack } from "@/services/locationService";
import { InventoryItem } from "@prisma/client";
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
import { Package, Plus, Trash2, Search, Grid, List } from "lucide-react";
import { InventoryItemType } from "@prisma/client";
import DraggableBunch from "./DraggableBunch";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

interface BunchManagerProps {
  rack: Rack;
  onUpdate: () => void;
}

interface ItemData {
  name: string;
  type: InventoryItemType;
  quantity: number;
  unit: string;
}

export default function BunchManager({ rack, onUpdate }: BunchManagerProps) {
  const { toast } = useToast();
  const [isAddBunchOpen, setIsAddBunchOpen] = useState(false);
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);
  const [selectedBunch, setSelectedBunch] = useState<Bunch | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [newBunchData, setNewBunchData] = useState({
    name: "",
    description: "",
  });
  const [newItemData, setNewItemData] = useState<ItemData>({
    name: "",
    type: InventoryItemType.FABRIC,
    quantity: 0,
    unit: "",
  });

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

  const handleAddItem = async (
    bunchId: number,
    itemData: {
      name: string;
      type: InventoryItemType;
      quantity: number;
      unit: string;
    }
  ) => {
    try {
      await bunchService.addItemsToBunch(bunchId, [itemData]);
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      refetchBunches();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add item: ${error}`,
      });
    }
  };

  const handleDeleteItem = async (bunch_id: number, item_id: string) => {
    try {
      await bunchService.deleteItemsFromBunch(bunch_id, [item_id]);
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

  const handleMoveBunch = async (bunchId: number, newRackId: number) => {
    try {
      await bunchService.moveBunch(bunchId, newRackId);
      toast({
        title: "Success",
        description: "Bunch moved successfully",
      });
      refetchBunches();
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to move bunch: ${error}`,
      });
    }
  };

  const handleDeleteBunch = async (bunchId: number) => {
    try {
      await bunchService.deleteBunch(bunchId);
      toast({
        title: "Success",
        description: "Bunch deleted successfully",
      });
      refetchBunches();
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete bunch: ${error}`,
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside a droppable area or in the same position
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Get the bunch that was moved
    const movedBunch = bunches?.find(
      (bunch: Bunch) => bunch.id.toString() === result.draggableId
    );

    if (!movedBunch) return;

    // If moving to a different rack
    if (source.droppableId !== destination.droppableId) {
      try {
        await handleMoveBunch(movedBunch.id, parseInt(destination.droppableId));
        toast({
          title: "Success",
          description: `Bunch "${movedBunch.name}" moved successfully`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to move bunch: ${error}`,
        });
      }
    }
  };

  const filteredBunches = bunches
    ?.filter((bunch: Bunch) =>
      bunch.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: Bunch, b: Bunch) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bunches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "name" | "createdAt")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div>Loading bunches...</div>
        ) : (
          <Droppable droppableId={rack.id.toString()}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } ${
                  snapshot.isDraggingOver ? "bg-muted/50 rounded-lg p-4" : ""
                }`}
              >
                {filteredBunches?.map((bunch: Bunch, index: number) => (
                  <DraggableBunch
                    key={bunch.id}
                    bunch={bunch}
                    index={index}
                    onDelete={(bunchId) => {
                      handleDeleteBunch(bunchId);
                    }}
                    onMove={handleMoveBunch}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    </DragDropContext>
  );
}
