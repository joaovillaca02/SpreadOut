"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

type RadioStation = {
  name: string;
  url: string;
  country: string;
  [key: string]: unknown;
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
        const response = await fetch("https://de1.api.radio-browser.info/json/stations?limit=50");
        const data: RadioStation[]  = await response.json();
  
        const filteredStations = data
          .filter(station => station.url && station.name)
          .map(station => ({
            name: station.name,
            url: station.url,
            country: station.country || "Desconhecido",
          }));
  
        if (filteredStations.length > 0) {
          setStations(filteredStations);
          setCurrentStationIndex(0);
        }
      } catch (err) {
        console.error("Erro ao buscar estações de rádio:", err);
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
        .catch((error) => console.error("Erro ao reproduzir áudio:", error));
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

  if (loading) return <div className="text-center p-4">Carregando estações...</div>;

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 text-center">Non-Copyright Radio</h2>

        <audio ref={audioRef} style={{ display: "none" }} />

        <p className="text-center mb-4 font-semibold">
          Estação atual: {stations[currentStationIndex]?.name} ({stations[currentStationIndex]?.country})
        </p>

        <div className="flex justify-between mb-4">
          <Button onClick={() => changeStation((currentStationIndex - 1 + stations.length) % stations.length)}>
            Anterior
          </Button>
          {isPlaying ? <Button onClick={stopRadio}>Pausar</Button> : <Button onClick={playRadio}>Play</Button>}
          <Button onClick={() => changeStation((currentStationIndex + 1) % stations.length)}>
            Próxima
          </Button>
        </div>

        <div className="flex items-center mb-4">
          <span className="mr-2">Volume:</span>
          <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-full" />
        </div>

        {/* Lista de estações */}
        <div className="mt-4 border-t pt-4 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Lista de Estações:</h3>
          <ul>
            {stations.map((station, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{station.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({station.country})</span>
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
