"use client";
import { useState, useRef } from "react";
import { Download, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import * as htmlToImage from "html-to-image";
import ProfilePrintCard from "./ProfilePrintCard"; // To be created
import { useSession } from "next-auth/react";

export default function ExportProfileButtons({ userData }) {
  const [exporting, setExporting] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const cardRef = useRef(null);
  const { data: session } = useSession();

  // JSON export logic (same as before)
  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const response = await fetch("/api/profile/export");
      if (!response.ok) throw new Error("Export failed");

      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/\"/g, "")
        : "codecracker-profile.json";

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Profile exported as JSON!", {
        style: {
          background: '#ff7a00',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    } catch (error) {
      toast.error("Failed to export profile", {
        style: {
          background: '#ff7a00',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  // PNG export logic
  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    try {
      setExportingImage(true);
      // Use html-to-image to export the card as PNG (high quality)
      const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `profile-card-${userData?.username || "user"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Profile card exported as PNG!", {
        style: {
          background: '#ff7a00',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    } catch (error) {
      toast.error("Failed to export card as PNG", {
        style: {
          background: '#ff7a00',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
      console.error("PNG export error:", error);
    } finally {
      setExportingImage(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {/* Hidden printable card for PNG export */}
      <div style={{ position: "absolute", left: -9999, top: 0 }}>
        <div ref={cardRef}>
          <ProfilePrintCard userData={userData} session={session} />
        </div>
      </div>
      {/* JSON Export Button */}
      <button
        onClick={handleExportJSON}
        disabled={exporting}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        {exporting ? "Exporting..." : "Export JSON"}
      </button>
      {/* PNG Export Button */}
      <button
        onClick={handleExportPNG}
        disabled={exportingImage}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <ImageIcon className="w-5 h-5" />
        {exportingImage ? "Exporting..." : "Export PNG"}
      </button>
    </div>
  );
} 