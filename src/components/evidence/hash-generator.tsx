"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Check, Copy, FileDigit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateSHA256 } from "@/lib/utils/hash";

interface HashGeneratorProps {
  onHashGenerated: (hash: string) => void;
}

export function HashGenerator({ onHashGenerated }: HashGeneratorProps) {
  const [hash, setHash] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setIsHashing(true);
      setFileName(file.name);
      try {
        const result = await generateSHA256(file);
        setHash(result);
        onHashGenerated(result);
      } finally {
        setIsHashing(false);
      }
    },
    [onHashGenerated]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileDigit className="h-5 w-5" />
          SHA-256 Hash Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            {isHashing ? "Generating hash..." : "Drag and drop a file or click to browse"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
          />
        </div>

        {hash && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              File: <span className="font-medium">{fileName}</span>
            </p>
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <code className="flex-1 text-xs break-all">{hash}</code>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Your file never leaves your browser. Only the SHA-256 hash is generated locally.
        </p>
      </CardContent>
    </Card>
  );
}
