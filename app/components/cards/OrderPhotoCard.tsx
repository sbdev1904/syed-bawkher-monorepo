"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import orderService from "../../services/orderService";
import axios from "axios";

interface FileItem {
  uid: string;
  name: string;
  status: string;
  url: string;
  originFileObj?: File;
  preview?: string;
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const OrderPhotoCard = ({ orderNo }: { orderNo: string }) => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchOrderPhotos = async () => {
      try {
        const photoUrls = await orderService.getOrderPhotos(orderNo);
        const formattedFileList = photoUrls.map((url: any, index: number) => ({
          uid: `order-photo-${index}`,
          name: url.key,
          status: "done",
          url: url.url,
        }));
        setFileList(formattedFileList);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order photos."
        });
      }
    };

    fetchOrderPhotos();
  }, [orderNo, toast]);

  const handlePreview = async (file: FileItem) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const response = await orderService.getPresignedUrl(orderNo, file.name);
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
        description: `${file.name} uploaded successfully.`
      });

      setFileList((prevList) => [
        ...prevList,
        {
          uid: `order-photo-${prevList.length + 1}`,
          name: file.name,
          status: "done",
          url: presignedUrl.split("?")[0], // remove query params for the display URL
        },
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${file.name} upload failed.`
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const showDeleteModal = (file: FileItem) => {
    setFileToDelete(file);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await orderService.deletePhoto(orderNo, fileToDelete.name);
      toast({
        title: "Success",
        description: `${fileToDelete.name} deleted successfully.`
      });
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== fileToDelete.uid)
      );
      setDeleteModalVisible(false);
      setFileToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${fileToDelete.name}.`
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Order Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {fileList.map((file) => (
              <div key={file.uid} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="cursor-pointer"
                    onClick={() => handlePreview(file)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => showDeleteModal(file)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fileList.length < 5 && (
              <div className="aspect-square flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-auto w-full max-h-[70vh] flex items-center justify-center">
            <Image
              src={previewImage}
              alt="Preview"
              width={800}
              height={600}
              style={{ objectFit: 'contain', maxHeight: '70vh' }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteModalVisible} onOpenChange={setDeleteModalVisible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {fileToDelete && (
            <div className="mb-4">
              <Image
                src={fileToDelete.url}
                alt={fileToDelete.name}
                width={400}
                height={300}
                style={{ objectFit: 'contain' }}
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFileToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderPhotoCard;
