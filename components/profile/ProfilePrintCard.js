import React from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { QRCodeSVG } from 'qrcode.react';


export default function ProfilePrintCard({ userData, session }) {
  // Helper to render a social icon with username and QR code
  const renderSocial = (type, url) => {
    if (!url) return null;
    const icons = {
      linkedin: <FaLinkedin size={20} color="#0A66C2" style={{ marginRight: 8 }} />,
      github: <FaGithub size={20} color="#fff" style={{ marginRight: 8 }} />,
      twitter: <FaTwitter size={20} color="#1DA1F2" style={{ marginRight: 8 }} />,
    };
    // Try to extract username from URL for display
    let display = url;
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length > 0) display = parts[parts.length - 1];
    } catch {
      // fallback to url
    }
    return (
      <div
        key={type}
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.10)",
          borderRadius: 12,
          padding: "7px 16px 7px 12px",
          fontSize: 16,
          color: "#fff",
          fontWeight: 500,
          minWidth: 160,
          maxWidth: 260,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          boxShadow: "0 1px 4px #fbbf2420",
          margin: "0 8px 8px 0",
        }}
        title={display}
      >
        {icons[type]}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", marginRight: 10 }}>{display}</span>
        {/* QR code for the link */}
        <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>
          <QRCodeSVG value={url} size={32} bgColor="#18181b" fgColor="#fbbf24" level="M" includeMargin={false} style={{ borderRadius: 4 }} />
        </span>
      </div>
    );
  };

  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      style={{
        width: 440,
        minHeight: 340,
        background: "linear-gradient(135deg, #18181b 60%, #f59e42 100%)",
        borderRadius: 28,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        color: "#fff",
        padding: 36,
        fontFamily: "'Outfit', 'Inter', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        border: "2px solid #fbbf24",
      }}
    >
      {/* Avatar with gradient ring */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          overflow: "hidden",
          marginBottom: 18,
          border: "4px solid #fbbf24",
          background: "linear-gradient(135deg, #fbbf24 40%, #f59e42 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px #fbbf2440",
        }}
      >
        {userData?.image && !imgError ? (
          <img
            src={userData.image}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: 40, fontWeight: 700, color: "#f59e42" }}>
            {userData?.name?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </div>
      {/* Name and Username */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>{userData?.name || "Your Name"}</div>
        <div style={{ fontSize: 17, color: "#fbbf24", fontWeight: 600, marginTop: 2 }}>
          @{userData?.username || "username"}
        </div>
      </div>
      {/* Email */}
      <div style={{ fontSize: 15, color: "#e5e7eb", marginBottom: 10 }}>{userData?.email}</div>
      {/* Redesigned socials row with QR codes */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
        marginBottom: 22,
        marginTop: 2,
        width: "100%",
        flexWrap: "wrap",
      }}>
        {renderSocial("linkedin", userData?.socials?.linkedin)}
        {renderSocial("github", userData?.socials?.github)}
        {renderSocial("twitter", userData?.socials?.twitter)}
      </div>
      {/* Platforms */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        width: "100%",
        marginTop: 8,
        marginBottom: 10,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        padding: "12px 18px",
        boxShadow: "0 1px 6px #fbbf2420",
      }}>
        {Object.entries(userData?.platforms || {}).map(([platform, username]) => (
          <div key={platform} style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: username ? "#fff" : "#fbbf24", fontWeight: 500, margin: "2px 0" }}>
            <span style={{ textTransform: "capitalize", letterSpacing: 0.5 }}>{platform}</span>
            <span>{username || <span style={{ opacity: 0.7 }}>Not set</span>}</span>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={{ position: "absolute", bottom: 18, right: 32, fontSize: 13, color: "#fbbf24", opacity: 0.85, fontWeight: 700, letterSpacing: 1 }}>
        quantum
      </div>
    </div>
  );
} 