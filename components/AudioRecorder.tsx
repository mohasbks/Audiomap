"use client";

import { useState, useRef, useCallback } from "react";

interface AudioRecorderProps {
  onTranscript: (text: string) => void;
  onError: (msg: string) => void;
  isProcessing: boolean;
}

type RecordingState = "idle" | "recording" | "uploading";

export default function AudioRecorder({ onTranscript, onError, isProcessing }: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setState("uploading");
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: formData });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          onTranscript(data.text);
        } catch (err) {
          onError("Failed to transcribe. Try again.");
          console.error(err);
        } finally {
          setState("idle");
        }
      };

      mediaRecorder.start();
      setState("recording");
    } catch {
      onError("Microphone access denied. Please allow microphone access.");
    }
  }, [onTranscript, onError]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const isRecording = state === "recording";
  const isUploading = state === "uploading";
  const disabled = isProcessing || isUploading;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      {/* Mic Button */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Pulse ring — only visible when recording */}
        {isRecording && (
          <span
            className="pulse-ring"
            style={{
              position: "absolute",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "1px solid var(--accent)",
              pointerEvents: "none",
            }}
          />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: isRecording ? "1px solid var(--accent)" : "1px solid var(--border)",
            background: isRecording ? "rgba(74, 111, 165, 0.12)" : "var(--surface)",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            opacity: disabled ? 0.5 : 1,
          }}
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {isRecording ? (
            /* Stop icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            /* Mic icon */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>
      </div>

      {/* Status label */}
      <p style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.02em" }}>
        {isUploading || isProcessing
          ? "Processing..."
          : isRecording
          ? "Recording — click to stop"
          : "Click to start recording"}
      </p>
    </div>
  );
}
