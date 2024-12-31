import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReceiptHeaderProps {
  title?: string;
  totalAmount?: number;
  shareUrl?: string;
  onTitleChange?: (title: string) => void;
  onShareClick?: () => void;
  onCopyUrl?: () => void;
}

const ReceiptHeader = ({
  title = "Cool Receipt",
  totalAmount = 0,
  shareUrl = "https://split.bill/abc123",
  onTitleChange = () => {},
  onShareClick = () => {},
  onCopyUrl = () => {},
}: ReceiptHeaderProps) => {
  return (
    <div className="w-full h-20 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-4">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl w-[300px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={onCopyUrl}
              >
                <Copy className="h-4 w-4" />
                <span className="hidden md:inline">Copy URL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy share link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex items-center space-x-2"
                onClick={onShareClick}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share receipt</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ReceiptHeader;
