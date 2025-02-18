// FloatingRadioWidget.tsx
'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@radix-ui/react-label';
import { useRadio } from '@/app/contexts/radio-context';
import { GrDrag, GrVolume } from 'react-icons/gr';

type FloatingPos = { x: number; y: number };

interface FloatingRadioWidgetProps {
  floatingPos: FloatingPos;
}

export const FloatingRadioWidget: React.FC<FloatingRadioWidgetProps> = ({ floatingPos }) => {
  const {
    audioRef,
    stations,
    currentStationIndex,
    volume,
    isPlaying,
    loading,
    playRadio,
    stopRadio,
    changeStation,
    handleVolumeChange,
  } = useRadio();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'floating-radio-widget',
  });

  // Because we're using absolute positioning relative to the SidebarInset,
  // our floatingPos coordinates will be relative to that container.
  const x = floatingPos.x + (transform?.x || 0);
  const y = floatingPos.y + (transform?.y || 0);

  const containerStyle = {
    position: 'absolute' as const, // Changed from 'fixed' to 'absolute'
    transform: `translate3d(${x}px, ${y}px, 0)`,
    zIndex: 1000,
  };

  if (loading) {
    return <div className="text-center p-4">Carregando estações...</div>;
  }

  return (
    <div id="floating-radio-widget" style={containerStyle} ref={setNodeRef}>
      <Card className="p-2 w-full max-w-xs rounded-md shadow-md bg-white dark:bg-gray-800">
        {/* Drag Handle */}
        <div {...listeners} {...attributes} className="cursor-grab p-1 rounded-t-md">
          <Label className="text-sm flex items-center space-x-1">
            <GrDrag /> 🎵 Rádio
          </Label>
        </div>
        <CardContent className="space-y-2">
          <audio ref={audioRef} style={{ display: 'none' }} />
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={stations[currentStationIndex].favicon} alt="" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {stations[currentStationIndex]?.name}
            </span>
          </div>
          <div className="flex justify-around space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                changeStation((currentStationIndex - 1 + stations.length) % stations.length)
              }
              aria-label="Anterior"
              className="rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-7 7 7 7" />
              </svg>
            </Button>
            {isPlaying ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopRadio}
                aria-label="Pausar"
                className="rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 19V6M18 19V6" />
                </svg>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={playRadio}
                aria-label="Play"
                className="rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l14 9-14 9V3z" />
                </svg>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                changeStation((currentStationIndex + 1) % stations.length)
              }
              aria-label="Próxima"
              className="rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l7 7-7 7" />
              </svg>
            </Button>
          </div>
          <div className="flex items-center mb-4">
            <GrVolume className="mr-2" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingRadioWidget;
