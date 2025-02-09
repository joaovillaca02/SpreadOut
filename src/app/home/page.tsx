'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { RadioPlayer } from '@/components/radio-player';
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
import { useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const [rssFeedUrl, setFeedUrl] = useState(
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
  );
  return (
    <SidebarProvider>
      <AppSidebar
        onFeedChange={(feedName, feedUrl) => {
          toast(`Fonte de notícias atualizada para: ${feedName}`);
          setFeedUrl(feedUrl);
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
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
          </div>
          <ModeToggle />
        </header>
        <div className="flex justify-between gap-4 p-4 pt-0">
          <RSSFeed feedUrl={rssFeedUrl} />
          <RadioPlayer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
