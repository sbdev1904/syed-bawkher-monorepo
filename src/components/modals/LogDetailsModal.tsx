"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export interface LogData {
  timestamp: string | number;
  type: string;
  user: string;
  description: string;
  details: Record<string, unknown>;
  relatedId?: string;
}

interface LogDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  logData: LogData | null;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ isVisible, onClose, logData }) => {
  if (!logData) return null;

  const getTagVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "order":
        return "default";
      case "inventory":
        return "secondary";
      case "status":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
            <div className="font-medium">Timestamp:</div>
            <div>{new Date(logData.timestamp).toLocaleString()}</div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
            <div className="font-medium">Type:</div>
            <Badge variant={getTagVariant(logData.type)}>{logData.type}</Badge>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
            <div className="font-medium">User:</div>
            <div>{logData.user}</div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
            <div className="font-medium">Description:</div>
            <div>{logData.description}</div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
            <div className="font-medium">Details:</div>
            <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-2 rounded-md text-sm overflow-auto max-h-40">
              {JSON.stringify(logData.details, null, 2)}
            </pre>
          </div>

          {logData.relatedId && (
            <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
              <div className="font-medium">Related ID:</div>
              <div>{logData.relatedId}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDetailsModal; 