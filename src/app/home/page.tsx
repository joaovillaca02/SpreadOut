// Page.tsx
'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useRef, useState } from 'react';
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
import { ModeToggle } from '@/components/mode-toggle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Page() {
  
  const [rssFeedUrl, setFeedUrl] = useState(
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
  );
  const [feedName, setFeedName] = useState('The New York Times');
  
  // Start the widget inside the SidebarInset (for example, 20px from the left and below the header)
  const [floatingPos, setFloatingPos] = useState({ x: 20, y: 70 });
  const [viewMode, setViewMode] = useState<'rss' | 'radio'>('rss');

  // Get a ref for the SidebarInset
  const sidebarInsetRef = useRef<HTMLDivElement>(null);

  function handleDragEnd(event: DragEndEvent) {
    if (event.active.id === 'floating-radio-widget') {
      const { delta } = event;
      let newX = floatingPos.x + delta.x;
      let newY = floatingPos.y + delta.y;

      // Use the container's dimensions (relative to SidebarInset)
      const container = sidebarInsetRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const headerHeight = 64; // Adjust to match your header height

        // Get the widget's dimensions (using offsetWidth/offsetHeight)
        const widgetEl = document.getElementById('floating-radio-widget');
        const widgetWidth = widgetEl?.offsetWidth || 0;
        const widgetHeight = widgetEl?.offsetHeight || 0;

        // Clamp so widget stays within the container's bounds
        if (newX < 0) newX = 0;
        if (newY < headerHeight) newY = headerHeight;
        if (newX + widgetWidth > containerWidth) {
          newX = containerWidth - widgetWidth;
        }
        if (newY + widgetHeight > containerHeight) {
          newY = containerHeight - widgetHeight;
        }
      }

      setFloatingPos({ x: newX, y: newY });
    }
  }
  
const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <RadioProvider>
      <SidebarProvider>
        <AppSidebar
          onFeedChange={(feedName, feedUrl) => {
            toast(`Fonte de notícias atualizada para: ${feedName}`);
            setFeedUrl(feedUrl);
            setFeedName(feedName);
          }}
          onViewModeChange={(viewMode) => setViewMode(viewMode)}
          viewMode={viewMode}
        >
          
        </AppSidebar>
        <SidebarInset ref={sidebarInsetRef}>
          <header className="flex h-16 items-center shrink-0 gap-2 px-4">
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
            <ModeToggle/>
          </header>
          <div className="relative w-full h-full overflow-hidden">
            {viewMode === 'rss' ? (
              <>
                <DndContext onDragEnd={(event) => handleDragEnd(event)}>
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
    </QueryClientProvider>
  );
}


