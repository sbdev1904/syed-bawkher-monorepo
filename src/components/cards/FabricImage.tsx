"use client";
import React, { useState } from "react";
import { Inbox, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import fabricService from "../../services/fabricService";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FabricImageProps {
  fabricId: string;
  imageUrl: string | null;
  onImageUploadSuccess: () => void;
}

interface FileItem {
  uid: string;
  name: string;
  status: string;
  url: string;
}

const FabricImage = ({ fabricId, imageUrl, onImageUploadSuccess }: FabricImageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handle file upload with presigned URL
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setLoading(true);

    try {
      // Request presigned URL from the backend
      const response = await fabricService.getPresignedUrl(fabricId, file.name);
      const presignedUrl = response.url;

      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };

      // Upload the file in binary format
      await axios.put(presignedUrl, file, config);

      toast({
        title: "Success",
        description: `${file.name} uploaded successfully.`,
      });

      // Update file list and refresh the image
      setFileList((prevList) => [
        ...prevList,
        {
          uid: `fabric-image-${prevList.length + 1}`, // Unique keys for the uploaded images
          name: file.name,
          status: "done",
          url: presignedUrl.split("?")[0], // URL for displaying the image (without query params)
        },
      ]);

      // Notify parent of success (e.g., to refresh the displayed image)
      onImageUploadSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${file.name} upload failed.`,
      });
    } finally {
      setLoading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  // Handle image deletion
  const handleDelete = async () => {
    try {
      setLoading(true);
      await fabricService.deleteFabricImage(fabricId);
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      });

      // Notify parent or refresh the component state
      onImageUploadSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the image.",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleViewFabric = () => {
    router.push(`/fabric/${fabricId}`);
  };

  return (
    <div>
      {!imageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <label className="cursor-pointer flex flex-col items-center justify-center w-full">
            <Inbox className="h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Click or drag file to this area to upload
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
        </div>
      )}

      {imageUrl && (
        <div className="relative">
          <div className="w-[150px] h-auto mt-2 overflow-hidden rounded-md">
            <img src={imageUrl} alt="Fabric" className="w-full h-auto" />
          </div>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-2 bg-black/50 hover:bg-black/70"
              >
                <Trash2 className="h-4 w-4 text-white hover:text-red-400" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the image.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default FabricImage;
