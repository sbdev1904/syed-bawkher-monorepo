import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Bunch } from "@/services/locationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryItemType } from "@prisma/client";

interface DraggableBunchProps {
  bunch: Bunch;
  index: number;
  onDelete: (bunchId: number) => void;
  onMove: (bunchId: number, newRackId: number) => void;
  onAddItem: (
    bunchId: number,
    itemData: {
      name: string;
      type: InventoryItemType;
      quantity: number;
      unit: string;
    }
  ) => void;
  onDeleteItem: (bunchId: number, itemId: string) => void;
}

const DraggableBunch: React.FC<DraggableBunchProps> = ({
  bunch,
  index,
  onDelete,
  // onMove,
  onAddItem,
  onDeleteItem,
}) => {
  const [isAddItemOpen, setIsAddItemOpen] = React.useState(false);
  const [newItemData, setNewItemData] = React.useState({
    name: "",
    type: InventoryItemType.FABRIC as InventoryItemType,
    quantity: 0,
    unit: "",
  });

  const handleAddItem = () => {
    onAddItem(bunch.id, newItemData);
    setIsAddItemOpen(false);
    setNewItemData({
      name: "",
      type: InventoryItemType.FABRIC as InventoryItemType,
      quantity: 0,
      unit: "",
    });
  };

  return (
    <Draggable draggableId={bunch.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`transition-all duration-200 ${snapshot.isDragging ? "opacity-50" : ""
            }`}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <CardTitle>{bunch.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
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
                              setNewItemData({
                                ...newItemData,
                                type: value as InventoryItemType,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={InventoryItemType.FABRIC}>
                                Fabric
                              </SelectItem>
                              <SelectItem
                                value={InventoryItemType.RAW_MATERIAL}
                              >
                                Raw Material
                              </SelectItem>
                              <SelectItem
                                value={InventoryItemType.PACKAGING_MATERIAL}
                              >
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(bunch.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bunch.items.map((item) => (
                  <div
                    key={item.item_id}
                    className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.item_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} - {item.item_type}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteItem(bunch.id, item.item_id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableBunch;
