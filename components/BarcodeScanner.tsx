"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateCharacterFromBarcode, type CharacterResult } from "@/lib/generateCharacter";

type ScannerStatus = "idle" | "starting" | "scanning" | "found" | "error";

const permissionMessage =
  "Camera permission was denied. Allow camera access in your browser settings, then try again.";

function isPermissionError(error: unknown): boolean {
  return error instanceof DOMException && ["NotAllowedError", "PermissionDeniedError"].includes(error.name);
}

function formatTraitLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const reader = useMemo(() => new BrowserMultiFormatReader(), []);
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [scanHint, setScanHint] = useState("Point your camera at a barcode.");
  const [result, setResult] = useState<CharacterResult | null>(null);
  const [copied, setCopied] = useState(false);

  const videoConstraints = useMemo<MediaStreamConstraints>(
    () => ({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }),
    [],
  );

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    setCopied(false);
    setResult(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setError("This browser does not support camera scanning. Try a modern mobile browser over HTTPS.");
      return;
    }

    if (!videoRef.current) {
      return;
    }

    setStatus("starting");
    setScanHint("Requesting camera access...");

    try {
      controlsRef.current = await reader.decodeFromConstraints(
        videoConstraints,
        videoRef.current,
        (scanResult, scanError) => {
          if (scanResult) {
            const generated = generateCharacterFromBarcode(scanResult.getText());

            if (generated) {
              setResult(generated);
              setStatus("found");
              setScanHint("Barcode captured.");
              stopScanner();
            }
          } else if (scanError) {
            setScanHint("Scanning... keep the barcode centered and well lit.");
          }
        },
      );
      setStatus("scanning");
      setScanHint("Scanning... keep the barcode centered and well lit.");
    } catch (scanError) {
      setStatus("error");
      setError(
        isPermissionError(scanError)
          ? permissionMessage
          : "Unable to start the camera scanner. Check camera availability and try again.",
      );
      stopScanner();
    }
  }, [reader, stopScanner, videoConstraints]);

  useEffect(() => {
    void startScanner();
    return () => stopScanner();
  }, [startScanner, stopScanner]);

  async function copyPrompt() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
    } catch {
      setError("Clipboard copy is unavailable in this browser. Select and copy the prompt manually.");
    }
  }

  return (
    <section className="scanner-card" aria-live="polite">
      <div className="camera-frame">
        <video ref={videoRef} className="camera-video" muted playsInline aria-label="Barcode scanner camera preview" />
        <div className="scan-line" />
      </div>

      <p className="status-text">{error ?? scanHint}</p>

      {status === "error" && (
        <button className="primary-button" type="button" onClick={startScanner}>
          Try camera again
        </button>
      )}

      {result && (
        <div className="result-panel">
          <div>
            <span className="label">Scanned barcode</span>
            <strong className="barcode-value">{result.barcode}</strong>
          </div>

          <div className="scene-event-card">
            <span className="label">Scene event</span>
            <strong>{result.traits.sceneEvent}</strong>
          </div>

          <details className="collapsible-section" open>
            <summary>Character traits</summary>
            <div className="traits-grid">
              {Object.entries(result.traits)
                .filter(([key]) => key !== "sceneEvent")
                .map(([key, value]) => (
                  <div className="trait" key={key}>
                    <span>{formatTraitLabel(key)}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
            </div>
          </details>

          <details className="collapsible-section" open>
            <summary>Generated prompt</summary>
            <div className="prompt-box">
              <span className="label">Prompt text</span>
              <p>{result.prompt}</p>
            </div>
          </details>

          <div className="actions">
            <button className="primary-button" type="button" onClick={copyPrompt}>
              {copied ? "Copied!" : "Copy prompt"}
            </button>
            <button className="secondary-button" type="button" onClick={startScanner}>
              Scan again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
