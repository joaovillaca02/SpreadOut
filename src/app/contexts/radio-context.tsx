'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

export type RadioStation = {
    name: string;
    url: string;
    country: string;
    favicon: string;
    tags: string;
    [key: string]: string;
  };

interface RadioContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  stations: RadioStation[];
  currentStationIndex: number;
  volume: number;
  isPlaying: boolean;
  loading: boolean;
  playRadio: () => void;
  stopRadio: () => void;
  changeStation: (index: number) => void;
  handleVolumeChange: (value: number[]) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(
          'https://de1.api.radio-browser.info/json/stations?limit=50'
        );
        const data: RadioStation[] = await response.json();
        const filteredStations = data
          .filter((station) => station.url && station.name)
          .map((station) => ({
            name: station.name,
            url: station.url,
            country: station.country || 'Desconhecido',
            favicon: station.favicon || '',
            tags: station.tags || '',
          }));
        if (filteredStations.length > 0) {
          setStations(filteredStations);
          setCurrentStationIndex(0);
        }
      } catch (err) {
        console.error('Erro ao buscar estações de rádio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const playRadio = () => {
    if (audioRef.current && stations.length > 0) {
      audioRef.current.src = stations[currentStationIndex].url;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Erro ao reproduzir áudio:', error));
    }
  };

  const stopRadio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeStation = (index: number) => {
    if (stations.length === 0) return;
    setCurrentStationIndex(index);
    if (audioRef.current) {
      audioRef.current.src = stations[index].url;
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
    }
  };

  return (
    <RadioContext.Provider
      value={{
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
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
