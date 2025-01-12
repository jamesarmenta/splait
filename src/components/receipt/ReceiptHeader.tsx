import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Edit2, Check, X } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onTitleChange(editedTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-20 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-[300px]"
              placeholder="Receipt title"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-green-500"
              onClick={handleSave}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={handleCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium font-title">{title}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
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
