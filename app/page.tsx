import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import SectionVoted from '@/components/SectionVoted/SectionVoted';
import StatsLiked from '@/components/StatsLiked';
import TopWindow from '@/components/TopWindow';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Header />
      <Navigation />
      <SectionVoted />
      <TopWindow />
    </>
  );
}
