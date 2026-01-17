import React from "react";
import { ApiMessage } from "@/app/services/http";

export interface MessageComponentProps {
  message: ApiMessage | null;
  style?: React.CSSProperties;
  className?: string;
  onlyError?: boolean;
}

export default function MessageComponent({
  message,
  style,
  className,
  onlyError,
}: MessageComponentProps) {
  return (
    <p
      style={{
        textAlign: "center",
        color: message && message.isError ? "red" : "green",
        opacity: message ? (onlyError ? +message.isError : 1) : 0,
        ...style,
      }}
      className={className}
    >
      {message ? message.message : "Waiting message..."}
    </p>
  );
}
