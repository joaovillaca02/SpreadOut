'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useRadio } from '@/app/contexts/radio-context';
import { GrPowerCycle, GrSearch } from 'react-icons/gr';

export default function RadioPlayer() {
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
    fetchMoreStations,
  } = useRadio();

  // Local pagination state for the list of stations.
  const [radioPage, setRadioPage] = useState(1);
  const radioStationsPerPage = 5;
  const totalStations = stations.length;
  const totalRadioPages = Math.ceil(totalStations / radioStationsPerPage);
  const currentStations = stations.slice(
    (radioPage - 1) * radioStationsPerPage,
    radioPage * radioStationsPerPage,
  );

  const setRandomStation = () => {
    const randomIndex = Math.floor(Math.random() * stations.length);
    changeStation(randomIndex);
  };

  if (loading) {
    return <div className="text-center p-4">Carregando estações...</div>;
  }

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 text-center">Radio Player</h2>
        <audio ref={audioRef} style={{ display: 'none' }} />
        <div className="flex justify-center items-center mb-4 font-semibold">
          <Avatar>
            <AvatarImage src={stations[currentStationIndex]?.favicon} alt="" />
            <AvatarFallback>?</AvatarFallback>
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
            onClick={() => changeStation((currentStationIndex + 1) % stations.length)}
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

        {/* Pagination controls between volume control and stations list */}
        <div className="mb-4">
          <Pagination>
            <PaginationContent className="flex overflow-x-auto">
              <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (radioPage > 1) setRadioPage(radioPage - 1);
            }}
            disabled={radioPage <= 1}
          />
              </PaginationItem>
              <div className="flex overflow-x-auto">
          {Array.from({ length: totalRadioPages }, (_, i) => i + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={(e) => {
            e.preventDefault();
            setRadioPage(pageNumber);
                }}
                isActive={pageNumber === radioPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
              </div>
              <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (radioPage < totalRadioPages) setRadioPage(radioPage + 1);
            }}
            disabled={radioPage >= totalRadioPages}
          />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Paginated list of stations */}
        <div className="mt-4 border-t pt-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Lista de Estações:</h3>
          <ul>
            {currentStations.map((station, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={station.favicon} alt={station.name} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{station.name}</span>
                    <span className="text-sm text-gray-500">({station.country})</span>
                    {station.tags && (
                      <span className="text-sm text-gray-500">
                        tags:{' '}
                        {station.tags.length > 30 ? `${station.tags.slice(0, 30)}...` : station.tags}
                      </span>
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={() => changeStation((radioPage - 1) * radioStationsPerPage + index)}>
                  Tocar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <div className="mb-4 justify-center flex space-x-2">
          <Button variant="outline" onClick={fetchMoreStations}>
          <GrSearch/> Buscar mais estações
          </Button>
          <Button variant="outline" onClick={setRandomStation}>
          <GrPowerCycle/> Estação Aleatória
          </Button>
        </div>
    </Card>
  );
}
