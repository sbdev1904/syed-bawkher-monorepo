"use client";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import fabricService from "../../services/fabricService";
import { Barcode, Edit, Trash2, } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import FabricImage from "./FabricImage";
import { useRouter } from "next/navigation";
import EditTextileModal from "../modals/EditTextileModal";
import BarcodeComponent from "react-barcode";
import { Spinner } from "@/components/ui/spinner";

interface FabricData {
  fabric_id: string;
  description: string;
  available_length: number;
  fabric_code: string;
  stock_location: string;
  fabric_brand?: string | null;
  image?: string | null;
  barcode?: string | null;
}

const FabricCard = ({ fabric }: { fabric: FabricData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [fabricData, setFabricData] = useState<FabricData>(fabric);

  // Create the contentRef for react-to-print
  const contentRef = useRef(null);

  const fetchImageUrl = async () => {
    try {
      const result = await fabricService.getFabricImageUrl(
        fabricData.fabric_id
      );
      setImageUrl(result.url);
    } catch (error) {
      console.error("Error fetching fabric image URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (fabricData.image) {
      fetchImageUrl();
    } else {
      setIsLoading(false);
    }
  }, [fabricData.image, fabricData.fabric_id]);

  const handleImageUploadSuccess = () => {
    fetchImageUrl();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await fabricService.deleteFabric(fabricData.fabric_id);
      toast({
        title: "Success",
        description: "Fabric deleted successfully.",
      });
      router.push("/fabrics");
    } catch (error) {
      console.error("Error deleting fabric:", error);
      toast({
        title: "Error",
        description: "Failed to delete the fabric.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFabricUpdate = (updatedFabric: FabricData) => {
    setFabricData(updatedFabric);
  };

  // Print handler using contentRef
  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `@page { margin: 0; } body { display: flex; justify-content: center; align-items: center; height: 100vh; }`,
  });

  const onPrintClick = () => {
    handlePrint();
  };

  return (
    <div className="flex flex-row bg-slate-800 shadow-lg rounded-lg p-4 justify-between">
      {isLoading ? (
        <div className="w-full flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row space-x-5">
              <div className="flex flex-col space-y-0 mb-2">
                <div className="text-lg font-bold text-white">{fabricData.fabric_code}</div>
                <div className="text-sm font-extrabold text-gray-400">
                  {fabricData.description}
                </div>
              </div>
              <div className="">
                <div className="flex flex-row space-x-2 items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsEditModalVisible(true)}
                        >
                          <Edit className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Fabric</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onPrintClick}>
                          <Barcode className="h-4 w-4 text-green-400 hover:text-green-300" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Print Barcode</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          fabric and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
            <div className="text-md mb-2 text-gray-300">
              <strong className="text-white">ID:</strong> {fabricData.fabric_id}
            </div>
            <div className="text-md mb-2 text-gray-300">
              <strong className="text-white">Available Length:</strong> {fabricData.available_length}{" "}
              meters
            </div>
            <div className="text-md mb-2 text-gray-300">
              <strong className="text-white">Brand:</strong> {fabricData.fabric_brand}
            </div>
            <div className="text-md mb-2 text-gray-300">
              <strong className="text-white">Stock Location:</strong> {fabricData.stock_location}
            </div>
            <div className="text-md mb-2 flex flex-row">
              <div ref={contentRef}>
                <BarcodeComponent
                  value={fabricData.fabric_id.toString()}
                  width={2}
                  height={40}
                  fontSize={12}
                  margin={0}
                  background="#1e293b"
                  lineColor="#ffffff"
                />
                <div className="print-only hidden" style={{ display: "none" }}>
                  Fabric: {fabricData.fabric_code}
                </div>
              </div>
            </div>
          </div>
          <div className="text-md mb-2">
            <FabricImage
              fabricId={fabricData.fabric_id}
              imageUrl={imageUrl}
              onImageUploadSuccess={handleImageUploadSuccess}
            />
          </div>
          <EditTextileModal
            open={isEditModalVisible}
            onOpenChange={(open) => setIsEditModalVisible(open)}
            fabric={fabricData}
            onUpdate={handleFabricUpdate}
          />
        </>
      )}
    </div>
  );
};

export default FabricCard;
