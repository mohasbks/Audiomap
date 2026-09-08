"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AudioRecorderProps { onTranscript: (text: string) => void; onError: (msg: string) => void; isProcessing: boolean }
type RecordingState = "idle" | "recording" | "uploading";

export default function AudioRecorder({ onTranscript, onError, isProcessing }: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const recorder = preferredType ? new MediaRecorder(stream, { mimeType: preferredType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setState("uploading");
        const formData = new FormData();
        formData.append("audio", new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }), "recording.webm");
        try {
          const response = await fetch("/api/transcribe", { method: "POST", body: formData });
          const data = await response.json();
          if (!response.ok || data.error) throw new Error(data.error || "Transcription failed");
          onTranscript(data.text);
        } catch (error) {
          onError(error instanceof Error ? error.message : "Failed to transcribe. Try text input instead.");
        } finally { setState("idle"); }
      };
      recorder.start();
      setElapsed(0);
      setState("recording");
    } catch { onError("Microphone access was denied. Allow access or use text input instead."); }
  }, [onError, onTranscript]);

  const isRecording = state === "recording";
  const isUploading = state === "uploading";
  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const elapsedLabel = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const disabled = isProcessing || isUploading;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "13px", padding: "8px 0 2px" }}>
      <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
        {isRecording ? <span className="pulse-ring" aria-hidden="true" style={{ position: "absolute", width: 76, height: 76, borderRadius: "50%", border: "1px solid var(--accent)", pointerEvents: "none" }} /> : null}
        <button onClick={isRecording ? () => mediaRecorderRef.current?.stop() : startRecording} disabled={disabled} style={{ width: 64, height: 64, borderRadius: "50%", border: `1px solid ${isRecording ? "var(--accent)" : "var(--border-2)"}`, background: isRecording ? "var(--accent-dim)" : "var(--surface)", color: "var(--accent)", display: "grid", placeItems: "center", cursor: disabled ? "not-allowed" : "pointer" }} aria-label={isRecording ? "Stop recording" : "Start recording"}>
          {isRecording ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></svg>}
        </button>
      </div>
      <p role="status" aria-live="polite" style={{ fontSize: 11, color: isRecording ? "var(--text)" : "var(--muted)" }}>{isUploading || isProcessing ? "Transcribing recording…" : isRecording ? `Recording ${elapsedLabel} · tap to stop` : "Tap to start recording"}</p>
    </div>
  );
}
