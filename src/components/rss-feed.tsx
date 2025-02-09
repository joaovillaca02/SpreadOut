import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import xml2js from 'xml2js';

type FeedItem = {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  creator?: string;
  imageUrl?: string;
};

const RSSFeed: React.FC<{ feedUrl: string }> = ({ feedUrl }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchRSS = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/rss?url=${encodeURIComponent(feedUrl)}`,
        );
        if (!response.ok) {
          throw new Error(`Erro ao buscar RSS: ${response.statusText}`);
        }

        const xmlData = await response.text();
        xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error('Erro ao parsear XML:', err);
            return;
          }

          const feedImage = result.rss.channel.image?.url || null;
          setImageUrl(feedImage);

          const items = result.rss.channel.item;
          if (!items) {
            console.warn('Nenhum item encontrado no feed');
            return;
          }

          const totalFeedItems = Array.isArray(items) ? items.length : 1;
          setTotalItems(totalFeedItems);

          const startIndex = (page - 1) * itemsPerPage;
          const pagedItems = Array.isArray(items)
            ? items.slice(startIndex, startIndex + itemsPerPage)
            : [items];

          const parsedItems = pagedItems.map(
            (item: {
              content: string | undefined;
              title: string;
              link: string;
              pubDate?: string;
              description?: string;
              creator?: string;
              'content:encoded'?: string;
              'media:group'?: { 'media:content'?: { $: { url: string } }[] };
              'media:content'?: { $: { url: string } };
              'dc:creator'?: string;
              'media:thumbnail'?: { $: { url: string } };
            }) => {
              let description =
                item.description ||
                item.content ||
                item['content:encoded'] ||
                '';

              let imageUrl =
                item['media:group']?.['media:content']?.[0]?.$.url ||
                item['media:content']?.$.url ||
                null;
              if (item['media:thumbnail']) {
                imageUrl = item['media:thumbnail']?.$.url || imageUrl;
              }

              // Verifica se a descrição contém uma tag <img>
              if (/<img[^>]+src="([^"]+)"/.test(description)) {
                // Regex para capturar a URL da imagem dentro do <description>
                const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
                imageUrl = imgMatch ? imgMatch[1] : null;

                // Remove a tag <img> da descrição
                description = description.replace(/<img[^>]+>/, '').trim();
                description = description.replace(/<br[^>]+>/, '').trim();
              }

              const creator =
                item['dc:creator'] || item.creator || 'Desconhecido';
              const link = item.link;

              return {
                title: item.title,
                description: description,
                pubDate: item.pubDate,
                imageUrl: imageUrl,
                creator: creator,
                link: link,
              };
            },
          ) as FeedItem[];

          setItems(parsedItems);
        });
      } catch (error) {
        console.error('Erro ao buscar feed RSS:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, [feedUrl, page, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="p-4 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Últimas Notícias</h2>

      {imageUrl && (
        <div className="flex justify-center mb-4">
          <Image
            src={imageUrl}
            alt="RSS Feed Logo"
            layout="intrinsic"
            width={250}
            height={40}
          />
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {/* Componente de Paginação */}
          <Pagination className="mb-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  disabled={page <= 1}
                />
              </PaginationItem>
              {[...Array(totalPages).keys()].map((i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    isActive={i + 1 === page}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {items.map((item, index) => (
            <Card key={index} className="mb-4 shadow-md">
              <CardContent>
                {item.imageUrl && (
                  <div className="m-2 p-2 w-full h-48 relative flex justify-center">
                    <Image
                      src={item.imageUrl}
                      alt={`Imagem relacionada a ${item.title}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold mt-2 mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <div className="text-sm text-gray-600 mb-2 text-justify">
                    {item.description.slice(0, 200) + '...'}
                  </div>
                )}
                {item.creator && (
                  <div className="text-sm text-gray-600 mb-2">
                    {'Por: ' + item.creator}
                  </div>
                )}
                {item.pubDate && (
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(item.pubDate).toLocaleString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                )}
                <Button variant="ghost" asChild className="mt-2">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    Ler mais
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default RSSFeed;
