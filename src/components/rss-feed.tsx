import React, { useEffect, useMemo, useState } from "react";
import Parser from "rss-parser";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FeedItem = {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  imageUrl?: string;
};

const RSSFeed: React.FC<{ feedUrl: string }> = ({ feedUrl }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState<number>(0);

  const parser = useMemo(() => new Parser(), []);

  useEffect(() => {
    const fetchRSS = async () => {
      setLoading(true);
      try {
        const feed = await parser.parseURL(feedUrl);
        const totalFeedItems = feed.items.length;
        setTotalItems(totalFeedItems);

        const startIndex = (page - 1) * itemsPerPage;
        const pagedItems = feed.items.slice(startIndex, startIndex + itemsPerPage);

        const parsedItems = pagedItems.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: item.description || item.content || item["content:encoded"],
          imageUrl: item["media:content"]?.url,
        })) as FeedItem[];

        setItems(parsedItems);

        if (feed.image?.url) {
          setImageUrl(feed.image.url);
        }
      } catch (error) {
        console.error("Erro ao buscar feed RSS:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSS();
  }, [feedUrl, page, parser, itemsPerPage]);

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < Math.ceil(totalItems / itemsPerPage)) {
      setPage(page + 1);
    }
  };

  return (
    <div className="p-4 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Últimas Notícias</h2>

      {imageUrl && (
        <div className="flex justify-center mb-4">
          <Image src={imageUrl} alt="RSS Feed Logo" width={250} height={40} />
        </div>
      )}

    {loading ? (
      <p>Carregando...</p>
    ) : (
      <>
        {/* Navegação de páginas */}
        <div className="flex justify-between mt-4 mb-2">
          <Button onClick={goToPreviousPage} disabled={page <= 1}>
            Página Anterior
          </Button>
          <span className="text-sm self-center">
            Página {page} de {Math.ceil(totalItems / itemsPerPage)}
          </span>
          <Button onClick={goToNextPage} disabled={page >= Math.ceil(totalItems / itemsPerPage)}>
            Próxima Página
          </Button>
        </div>
        {items.map((item, index) => (
          <Card key={index} className="mb-2">
            <CardContent>
              {item.imageUrl && (
                <div className="mb-2">
                  <Image
                    src={item.imageUrl}
                    alt={`Imagem relacionada a ${item.title}`}
                    width={180}
                    height={100}
                    className="object-cover rounded"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <div
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
              {item.pubDate && (
                <p className="text-sm text-gray-600">
                  {new Date(item.pubDate).toLocaleString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
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
