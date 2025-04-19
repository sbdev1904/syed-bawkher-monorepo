"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import locationService, { Location, Rack } from "@/services/locationService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Plus, Package, MapPin, Grid } from "lucide-react";
import BunchManager from "@/components/inventory/BunchManager";

export default function InventoryPage() {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isAddRackOpen, setIsAddRackOpen] = useState(false);
  const [newLocationData, setNewLocationData] = useState({
    name: "",
    description: "",
  });
  const [newRackData, setNewRackData] = useState({
    name: "",
    description: "",
    capacity: 100,
  });

  // Fetch locations
  const {
    data: locations,
    isLoading,
    refetch: refetchLocations,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAllLocations,
  });

  // Fetch racks for selected location
  const {
    data: racks,
    isLoading: isLoadingRacks,
    refetch: refetchRacks,
  } = useQuery({
    queryKey: ["racks", selectedLocation?.id],
    queryFn: () =>
      selectedLocation
        ? locationService.getRacksByLocation(selectedLocation.id)
        : null,
    enabled: !!selectedLocation,
  });

  const handleAddLocation = async () => {
    try {
      await locationService.createLocation(newLocationData);
      toast({
        title: "Success",
        description: "Location created successfully",
      });
      setIsAddLocationOpen(false);
      setNewLocationData({ name: "", description: "" });
      refetchLocations();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create location: ${error}`,
      });
    }
  };

  const handleAddRack = async () => {
    if (!selectedLocation) return;
    try {
      await locationService.createRack({
        ...newRackData,
        location_id: selectedLocation.id,
      });
      toast({
        title: "Success",
        description: "Rack created successfully",
      });
      setIsAddRackOpen(false);
      setNewRackData({ name: "", description: "", capacity: 100 });
      refetchRacks();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create rack: ${error}`,
      });
    }
  };

  const handleRackSelect = (rack: Rack) => {
    setSelectedRack(rack === selectedRack ? null : rack);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new location for inventory storage
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newLocationData.name}
                  onChange={(e) =>
                    setNewLocationData({
                      ...newLocationData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter location name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newLocationData.description}
                  onChange={(e) =>
                    setNewLocationData({
                      ...newLocationData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter location description"
                />
              </div>
            </div>
            <Button onClick={handleAddLocation}>Create Location</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations List */}
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>
              Select a location to view its racks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading locations...</div>
            ) : (
              <div className="space-y-4">
                {locations?.map((location: Location) => (
                  <Button
                    key={location.id}
                    variant={
                      selectedLocation?.id === location.id
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedLocation(location);
                      setSelectedRack(null);
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {location.name}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Racks List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Racks</CardTitle>
                <CardDescription>
                  {selectedLocation
                    ? `Racks in ${selectedLocation.name}`
                    : "Select a location to view racks"}
                </CardDescription>
              </div>
              {selectedLocation && (
                <Dialog open={isAddRackOpen} onOpenChange={setIsAddRackOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Rack
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Rack</DialogTitle>
                      <DialogDescription>
                        Create a new rack in {selectedLocation.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="rackName">Name</Label>
                        <Input
                          id="rackName"
                          value={newRackData.name}
                          onChange={(e) =>
                            setNewRackData({
                              ...newRackData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter rack name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="rackDescription">Description</Label>
                        <Textarea
                          id="rackDescription"
                          value={newRackData.description}
                          onChange={(e) =>
                            setNewRackData({
                              ...newRackData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter rack description"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newRackData.capacity}
                          onChange={(e) =>
                            setNewRackData({
                              ...newRackData,
                              capacity: parseInt(e.target.value),
                            })
                          }
                          placeholder="Enter rack capacity"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddRack}>Create Rack</Button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedLocation ? (
              <div className="text-center text-muted-foreground">
                Select a location to view its racks
              </div>
            ) : isLoadingRacks ? (
              <div>Loading racks...</div>
            ) : (
              <div className="space-y-4">
                {racks?.map((rack: Rack) => (
                  <Card
                    key={rack.id}
                    className={`cursor-pointer transition-colors ${
                      selectedRack?.id === rack.id
                        ? "border-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleRackSelect(rack)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Grid className="mr-2 h-4 w-4" />
                          <CardTitle className="text-lg">{rack.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span>
                            {rack.current_utilization}/{rack.capacity}
                          </span>
                        </div>
                        <Progress
                          value={
                            (rack.current_utilization / rack.capacity) * 100
                          }
                        />
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Package className="mr-2 h-4 w-4" />
                          {rack.bunches.length} bunches
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bunch Manager */}
        <Card>
          <CardContent className="p-6">
            {selectedRack ? (
              <BunchManager
                rack={selectedRack}
                onUpdate={() => {
                  refetchRacks();
                }}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                Select a rack to manage bunches and items
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
