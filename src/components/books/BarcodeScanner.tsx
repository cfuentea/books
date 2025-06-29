"use client";

import { BrowserMultiFormatReader, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    const findVideoDevice = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        if (videoDevices.length === 0) {
          setError("No camera found on this device.");
          return;
        }
        const rearCamera = videoDevices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('trasera')) || videoDevices[0];
        setVideoDevice(rearCamera);
      } catch (err) {
        console.error("Error enumerating devices:", err);
        setError("Could not access camera. Please ensure permissions are granted.");
      }
    };
    findVideoDevice();
  }, []);

  const startScan = () => {
    if (isScanningRef.current || !webcamRef.current?.video) {
        return;
    }
    isScanningRef.current = true;
    
    const decodeContinuously = () => {
        if (!webcamRef.current?.video) {
            isScanningRef.current = false;
            return;
        }

        codeReaderRef.current.decodeFromVideo(webcamRef.current.video)
            .then(result => {
                isScanningRef.current = false;
                onScan(result.getText());
            })
            .catch(err => {
                if (!(err instanceof NotFoundException || err instanceof ChecksumException || err instanceof FormatException)) {
                    console.error('An unexpected error occurred during decoding:', err);
                }

                if (isScanningRef.current) {
                    requestAnimationFrame(decodeContinuously);
                }
            });
    };
    
    requestAnimationFrame(decodeContinuously);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      isScanningRef.current = false;
    };
  }, []);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-background p-4 rounded-lg shadow-lg">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 z-10">
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-semibold text-center mb-2">Scan Barcode</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="relative w-full aspect-video overflow-hidden rounded-md">
            {videoDevice && (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                    deviceId: videoDevice.deviceId ? { exact: videoDevice.deviceId } : undefined,
                    facingMode: 'environment',
                    advanced: [
                        { focusMode: 'continuous' },
                        { zoom: 2.0 }
                    ]
                } as any}
                onUserMedia={startScan}
                onUserMediaError={(err) => {
                    console.error("Webcam error:", err);
                    setError("Failed to start camera. It might be in use by another application.");
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-2/5 border-4 border-red-500/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 