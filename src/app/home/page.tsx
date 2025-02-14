// Page.tsx
'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import RSSFeed from '@/components/rss-feed';
import { AppSidebar } from '@/components/ui/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { FloatingRadioWidget } from '@/components/radio-widget';
import { toast } from 'sonner';
import RadioPlayer from '@/components/radio-player';
import { RadioProvider } from '../contexts/radio-context';
import { Button } from '@/components/ui/button';

export default function Page() {
  const [rssFeedUrl, setFeedUrl] = useState(
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
  );
  const [feedName, setFeedName] = useState('The New York Times');
  const [floatingPos, setFloatingPos] = useState({ x: 20, y: 20 });
  const [viewMode, setViewMode] = useState<'rss' | 'radio'>('rss');

  function handleDragEnd(event: DragEndEvent) {
    if (event.active.id === 'floating-radio-widget') {
      if (event.over && event.over.id === 'sidebar') {
        return;
      }
      const { delta } = event;
      setFloatingPos((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    }
  }

  return (
    <RadioProvider>
      <SidebarProvider>
        <AppSidebar
          onFeedChange={(feedName, feedUrl) => {
            toast(`Fonte de notícias atualizada para: ${feedName}`);
            setFeedUrl(feedUrl);
            setFeedName(feedName);
          }}
        >
          <Button
            onClick={() => setViewMode(viewMode === 'rss' ? 'radio' : 'rss')}
            className="p-2 bg-blue-500 text-white rounded-md mt-4 w-full"
          >
            {viewMode === 'rss' ? 'Ir para Rádio' : 'Ir para RSS'}
          </Button>
        </AppSidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex justify-between gap-4 p-4 pt-0">
            {viewMode === 'rss' ? (
              <>
                <DndContext onDragEnd={handleDragEnd}>
                  <FloatingRadioWidget floatingPos={floatingPos} />
                </DndContext>
                <RSSFeed feedUrl={rssFeedUrl} feedName={feedName} />
              </>
            ) : (
              <RadioPlayer />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RadioProvider>
  );
}
