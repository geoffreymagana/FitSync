
"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Video } from 'lucide-react';

interface QrScannerProps {
  onScan: (result: string | null) => void;
}

export function QrScanner({ onScan }: QrScannerProps) {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerId = "qr-reader";

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setHasCameraPermission(true);
        } else {
          setHasCameraPermission(false);
        }
      } catch (error) {
        console.error('Error checking camera permission:', error);
        setHasCameraPermission(false);
         toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Could not access camera. Please enable camera permissions in your browser settings.',
        });
      }
    };
    checkCameraPermission();
  }, [toast]);

  useEffect(() => {
    if (hasCameraPermission === true) {
        const scanner = new Html5Qrcode(readerId, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] });
        scannerRef.current = scanner;

        const onScanSuccess = (decodedText: string, decodedResult: any) => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    onScan(decodedText);
                }).catch(err => {
                    console.error("Failed to stop scanner", err);
                    onScan(decodedText);
                });
            }
        };
        
        const onScanFailure = (error: any) => {
            // This is called frequently, so we don't want to spam the console or user
        };

        Html5Qrcode.getCameras().then(cameras => {
            if(cameras && cameras.length > 0) {
                 scanner.start(
                    { facingMode: "environment" },
                    { 
                        fps: 10, 
                        qrbox: (viewfinderWidth, viewfinderHeight) => ({
                            width: Math.min(viewfinderWidth, viewfinderHeight) * 0.7,
                            height: Math.min(viewfinderWidth, viewfinderHeight) * 0.7,
                        }),
                        supportedScanTypes: [Html5QrcodeSupportedFormats.QR_CODE]
                    },
                    onScanSuccess,
                    onScanFailure
                ).catch(err => {
                    console.error("Failed to start scanner", err);
                    toast({
                        variant: 'destructive',
                        title: 'Scanner Error',
                        description: 'Could not start the QR code scanner.',
                    });
                });
            }
        });

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.clear().catch(err => {
                    console.error("Error stopping scanner on cleanup", err);
                });
            }
        };
    }
  }, [hasCameraPermission, onScan, toast]);

  if (hasCameraPermission === null) {
      return <div className="flex items-center justify-center h-64">Checking camera permissions...</div>;
  }
  
  return (
    <div>
        {hasCameraPermission ? (
             <div id={readerId} className="w-full aspect-square" />
        ) : (
             <Alert variant="destructive">
                <Video className="h-4 w-4"/>
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access in your browser settings to use the QR scanner feature.
                </AlertDescription>
            </Alert>
        )}
    </div>
  );
}
