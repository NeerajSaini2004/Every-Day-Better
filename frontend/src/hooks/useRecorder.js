import { useState, useRef, useEffect } from 'react';

export const useRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const urlRef = useRef(null);

  // Revoke object URL on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRef.current.onstop = () => {
        // Revoke previous URL before creating a new one
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        urlRef.current = URL.createObjectURL(blob);
        setAudioURL(urlRef.current);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current.start();
      setRecording(true);
    } catch {
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  const stop = () => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.stop();
    }
    setRecording(false);
  };

  const clear = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setAudioURL(null);
  };

  return { recording, audioURL, error, start, stop, clear };
};
