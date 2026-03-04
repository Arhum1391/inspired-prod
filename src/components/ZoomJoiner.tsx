'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { parseZoomUrl } from '@/lib/zoomUtils';

export default function ZoomJoiner({ bootcampId }: { bootcampId: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<any>(null);
  const [status, setStatus] = useState<'joining' | 'error' | 'ready'>('joining');
  const [error, setError] = useState<string | null>(null);

  const joinMeeting = useCallback(async () => {
    if (!bootcampId) {
      setError('No bootcamp specified.');
      setStatus('error');
      return;
    }

    // Fetch Zoom link securely from backend (checks enrollment)
    let zoomLink = '';
    try {
      const res = await fetch(`/api/bootcamp/${bootcampId}/zoom`, {
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error ||
            'You are not enrolled in this bootcamp or Zoom access is not available.'
        );
      }
      zoomLink = data.zoomLink as string;
    } catch (err: any) {
      console.error('Failed to load Zoom link:', err);
      setError(
        err?.message ||
          'Unable to load Zoom link. Make sure you are logged in and enrolled in this bootcamp.'
      );
      setStatus('error');
      return;
    }

    const parsed = parseZoomUrl(zoomLink);
    if (!parsed) {
      console.error('parseZoomUrl failed for link:', zoomLink);
      setError('Invalid or missing Zoom link.');
      setStatus('error');
      return;
    }

    try {
      // Ensure the Zoom container element exists before initializing the SDK.
      // Use both the React ref and a DOM lookup as a fallback.
      let attempts = 0;
      let container: HTMLDivElement | null =
        containerRef.current || (document.getElementById('zoom-embed-root') as HTMLDivElement | null);

      while (!container && attempts < 30) {
        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, 100));
        container =
          containerRef.current || (document.getElementById('zoom-embed-root') as HTMLDivElement | null);
      }

      if (!container) {
        console.error('Zoom container not ready after waiting');
        setError('Zoom view is not ready. Please refresh and try again.');
        setStatus('error');
        return;
      }

      const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
      const client = ZoomMtgEmbedded.createClient();
      clientRef.current = client;

      await client.init({
        zoomAppRoot: container,
        patchJsMedia: true,
      });

      // When the meeting is closed (user clicks "Leave"), navigate back to bootcamps.
      client.on('connection-change', (payload: any) => {
        if (payload.state === 'Closed') {
          router.push('/bootcamp');
        }
      });

      const res = await fetch('/api/zoom/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingNumber: parsed.meetingNumber,
          role: 0,
          expirationSeconds: 7200,
        }),
      });

      const sig = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(sig.error || 'Failed to get Zoom credentials');
      }

      await client.join({
        signature: sig.signature,
        meetingNumber: parsed.meetingNumber,
        password: parsed.password,
        userName: 'Guest',
      });

      setStatus('ready');
    } catch (err: any) {
      console.error('Zoom join error:', err);
      setError(err?.message || 'Failed to join meeting');
      setStatus('error');
    }
  }, [bootcampId]);

  useEffect(() => {
    joinMeeting();
  }, [joinMeeting]);

  if (status === 'error') {
    return (
      <div className="rounded-lg bg-red-900/20 border border-red-500/30 p-4 text-sm text-red-300">
        {error}
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md bg-white text-[#0A0A0A] text-xs font-semibold hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {status === 'joining' && (
        <div className="mb-4">
          <LoadingScreen message="Joining Zoom meeting..." />
        </div>
      )}
      <div
        id="zoom-embed-root"
        ref={containerRef}
        className="w-full min-h-[500px] bg-[#1F1F1F] rounded-2xl overflow-hidden"
      />
    </div>
  );
}

