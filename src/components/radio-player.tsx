'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type RadioStation = {
  name: string;
  url: string;
  country: string;
  favicon: string;
  tags: string;
  [key: string]: string;
};

export const RadioPlayer: React.FC = () => {
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
          'https://de1.api.radio-browser.info/json/stations?limit=50',
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

  if (loading)
    return <div className="text-center p-4">Carregando estações...</div>;

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 text-center">Radio Player</h2>

        <audio ref={audioRef} style={{ display: 'none' }} />

        <div className="flex justify-center items-center mb-4 font-semibold">
          <Avatar>
            <AvatarImage src={stations[currentStationIndex].favicon} alt="" />
            <AvatarFallback> </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex flex-col">
            <span>Estação atual: {stations[currentStationIndex]?.name}</span>
            <span>({stations[currentStationIndex]?.country})</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() =>
              changeStation(
                (currentStationIndex - 1 + stations.length) % stations.length,
              )
            }
            className="rounded-full"
            aria-label="Anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 7l-7 7 7 7"
              />
            </svg>
          </Button>

          {isPlaying ? (
            <Button
              variant="destructive"
              onClick={stopRadio}
              className="rounded-full"
              aria-label="Pausar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 19V6M18 19V6"
                />
              </svg>
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={playRadio}
              className="rounded-full"
              aria-label="Play"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3l14 9-14 9V3z"
                />
              </svg>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() =>
              changeStation((currentStationIndex + 1) % stations.length)
            }
            className="rounded-full"
            aria-label="Próxima"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7l7 7-7 7"
              />
            </svg>
          </Button>
        </div>

        <div className="flex items-center mb-4">
          <span className="mr-2">Volume:</span>
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>

        {/* Lista de estações */}
        <div className="mt-4 border-t pt-4 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Lista de Estações:</h3>
          <ul>
            {stations.map((station, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={station.favicon} alt="" />
                    <AvatarFallback> </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{station.name}</span>
                    <span className="text-sm text-gray-500">
                      ({station.country})
                    </span>
                    {station.tags && (
                      <span className="text-sm text-gray-500">
                        tags:{' '}
                        {station.tags.length > 30
                          ? `${station.tags.slice(0, 30)}...`
                          : station.tags}
                      </span>
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={() => changeStation(index)}>
                  Tocar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioPlayer;
