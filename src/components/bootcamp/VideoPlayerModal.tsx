'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface Lesson {
  lessonId: string;
  title: string;
  youtubeVideoId: string;
  progress?: number;
}

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  bootcampId: string;
  allLessons?: Lesson[];
  onProgressUpdate?: () => void;
  onLessonChange?: (lesson: Lesson) => void;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  lesson,
  bootcampId,
  allLessons = [],
  onProgressUpdate,
  onLessonChange,
}: VideoPlayerModalProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // Calculate start time based on progress
  useEffect(() => {
    if (lesson?.progress && lesson.progress > 0) {
      // We'll get the actual duration from the player and calculate start time
      // For now, we'll start from the beginning and let the player handle it
      setStartTime(0);
    } else {
      setStartTime(0);
    }
  }, [lesson]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Save progress to API
  const saveProgress = useCallback(
    async (progress: number, completed: boolean = false) => {
      if (!lesson || isSaving) return;

      setIsSaving(true);
      try {
        const response = await fetch(
          `/api/bootcamp/${bootcampId}/lessons/${lesson.lessonId}/progress`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              progress: Math.round(progress),
              completed,
            }),
          }
        );

        if (response.ok) {
          setCurrentProgress(progress);
          if (onProgressUpdate) {
            onProgressUpdate();
          }
        } else {
          console.error('Failed to save progress');
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [lesson, bootcampId, isSaving, onProgressUpdate]
  );

  // Handle progress updates from video player
  const handleProgress = useCallback(
    (progress: number, currentTime: number, duration: number) => {
      setCurrentProgress(progress);
      
      // Auto-save progress every 10% or when near completion
      const roundedProgress = Math.round(progress);
      const lastSavedProgress = Math.round(currentProgress);
      
      if (
        Math.abs(roundedProgress - lastSavedProgress) >= 10 ||
        roundedProgress >= 90
      ) {
        saveProgress(progress, progress >= 90);
      }
    },
    [currentProgress, saveProgress]
  );

  // Handle video state changes
  const handleStateChange = useCallback(
    (state: number) => {
      // State codes: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
      if (state === 0) {
        // Video ended - mark as completed
        saveProgress(100, true);
      }
    },
    [saveProgress]
  );

  // Find current lesson index and get next/previous
  const currentIndex = allLessons.findIndex(
    (l) => l.lessonId === lesson?.lessonId
  );
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1
    ? allLessons[currentIndex + 1]
    : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  if (!isOpen || !lesson) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={(e) => {
        // Close if clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#1F1F1F] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg sm:text-xl text-white truncate"
              style={{ fontFamily: 'Gilroy-SemiBold' }}
            >
              {lesson.title}
            </h2>
            {currentProgress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {Math.round(currentProgress)}% watched
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-white/10"
            aria-label="Close video"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Player */}
        <div className="p-4 sm:p-6">
          <div className="w-full" style={{ aspectRatio: '21/9' }}>
            <VideoPlayer
              videoId={lesson.youtubeVideoId}
              onProgress={handleProgress}
              onStateChange={handleStateChange}
              startTime={startTime}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Footer with navigation */}
        {(prevLesson || nextLesson) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-t border-white/10">
            <button
              onClick={() => {
                if (prevLesson && onLessonChange) {
                  onLessonChange(prevLesson);
                }
              }}
              disabled={!prevLesson}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              Previous Lesson
            </button>
            <button
              onClick={() => {
                if (nextLesson && onLessonChange) {
                  onLessonChange(nextLesson);
                }
              }}
              disabled={!nextLesson}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              Next Lesson
            </button>
          </div>
        )}

        {/* Mark as Complete Button */}
        {currentProgress >= 90 && currentProgress < 100 && (
          <div className="p-4 sm:p-6 border-t border-white/10">
            <button
              onClick={() => saveProgress(100, true)}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              {isSaving ? 'Saving...' : 'Mark as Complete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

