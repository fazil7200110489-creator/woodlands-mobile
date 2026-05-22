"use client";

import { useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { toCurrency } from "@/lib/pickup";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (screenshotUrl: string) => void;
  isOpeningPayment?: boolean;
  isRedirecting?: boolean;
}

export default function PaymentModal({ isOpen, onClose, total, onConfirm, isOpeningPayment, isRedirecting }: PaymentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload the payment screenshot to continue.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onConfirm(data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload screenshot. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[32px] p-8 z-[110] shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Complete Payment</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Please complete the payment and upload the payment screenshot to continue.
              </p>

              <div className="w-full bg-secondary/50 rounded-2xl p-6 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-black text-primary">{toCurrency(total)}</p>
              </div>

              {/* QR Code Placeholder */}
              <div className="relative w-48 h-48 bg-white border-2 border-border rounded-2xl flex flex-col items-center justify-center mb-8 overflow-hidden p-2">
                <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center relative">
                  <div className="grid grid-cols-3 gap-1 opacity-20">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-black rounded" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <QrCode className="w-12 h-12 text-primary/40" />
                    <span className="font-bold text-[10px] uppercase tracking-tighter text-muted-foreground">UPI QR Code</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                   <span className="bg-white px-3 py-1 rounded-full border border-border shadow-sm font-bold text-[10px] uppercase tracking-widest text-primary">Scan to Pay</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                    preview ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-secondary/30",
                    error && "border-destructive/50 bg-destructive/5"
                  )}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {preview ? (
                    <div className="relative w-full h-full">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-bold">Change Screenshot</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-bold text-muted-foreground">Upload Screenshot</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">Tap to select or drag and drop</p>
                    </>
                  )}
                </div>

                {error && <p className="text-destructive text-xs font-bold">{error}</p>}

                <button
                  onClick={handleUpload}
                  disabled={isUploading || isRedirecting || isOpeningPayment}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2",
                    (isUploading || isRedirecting || isOpeningPayment) ? "bg-muted-foreground" : "bg-[#1C1C1E] hover:bg-primary"
                  )}
                >
                  {isOpeningPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Opening payment...</span>
                    </>
                  ) : isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading screenshot...</span>
                    </>
                  ) : isRedirecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Redirecting to WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Open WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
