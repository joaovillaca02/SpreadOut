'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import { TeamSwitcher } from '@/components/ui/team-switcher';
import { NavMain } from '@/components/ui/nav-main';
import { NavProjects } from '@/components/ui/nav-projects';
import { NavUser } from '@/components/ui/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

// Dados de exemplo
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: 'History', url: '#' },
        { title: 'Starred', url: '#' },
        { title: 'Settings', url: '#' },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        { title: 'Genesis', url: '#' },
        { title: 'Explorer', url: '#' },
        { title: 'Quantum', url: '#' },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        { title: 'Introduction', url: '#' },
        { title: 'Get Started', url: '#' },
        { title: 'Tutorials', url: '#' },
        { title: 'Changelog', url: '#' },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        { title: 'General', url: '#' },
        { title: 'Team', url: '#' },
        { title: 'Billing', url: '#' },
        { title: 'Limits', url: '#' },
      ],
    },
  ],
  projects: [
    { name: 'Design Engineering', url: '#', icon: Frame },
    { name: 'Sales & Marketing', url: '#', icon: PieChart },
    { name: 'Travel', url: '#', icon: Map },
  ],
};

export function AppSidebar({
  onFeedChange,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onFeedChange: (feedName: string, feedUrl: string) => void;
}) {
  const [rssFeedUrl, setRssFeedUrl] = useState(
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
  );
  // Lista de feeds RSS
  const rssFeeds = [
    {
      label: 'NY Times - Home Page',
      value: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    },
    { label: 'BBC News', value: 'http://feeds.bbci.co.uk/news/rss.xml' },
    { label: 'CNN', value: 'http://rss.cnn.com/rss/edition.rss' },
    { label: 'BBC Brasil', value: 'http://www.bbc.co.uk/portuguese/index.xml' },
    {
      label: 'Gazeta do Povo - Política',
      value: 'https://www.gazetadopovo.com.br/feed/rss/republica.xml',
    },
    {
      label: 'Gazeta do Povo - Economia',
      value: 'https://www.gazetadopovo.com.br/feed/rss/economia.xml',
    },
    {
      label: 'Gazeta do Povo - Opiniões',
      value: 'https://www.gazetadopovo.com.br/feed/rss/opiniao.xml',
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Combobox para selecionar o feed RSS */}
        <Select
          onValueChange={(value) => {
            const selectedFeed = rssFeeds.find((feed) => feed.value === value);
            setRssFeedUrl(value);
            if (selectedFeed) {
              onFeedChange(selectedFeed.label, selectedFeed.value);
            }
          }}
          value={rssFeedUrl}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select RSS Feed" />
          </SelectTrigger>
          <SelectContent>
            {rssFeeds.map((feed) => (
              <SelectItem key={feed.value} value={feed.value}>
                {feed.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />

        {/* Renderiza os children passados para a sidebar */}
        {children}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
