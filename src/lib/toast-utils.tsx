import { toast } from "@/components/ui/use-toast";

// Simple wrapper to provide antd message-like API
export const message = {
    success: (content: string) => {
        toast({
            title: "Success",
            description: content,
            variant: "default",
        });
    },
    error: (content: string) => {
        toast({
            title: "Error",
            description: content,
            variant: "destructive",
        });
    },
    info: (content: string) => {
        toast({
            title: "Info",
            description: content,
        });
    },
    warning: (content: string) => {
        toast({
            title: "Warning",
            description: content,
        });
    },
}; 