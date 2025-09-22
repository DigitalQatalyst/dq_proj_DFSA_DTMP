import DirectorySection from '../../components/discoverAbuDhabi/DirectorySection';
import GrowthAreasSection from '../../components/discoverAbuDhabi/GrowthAreasSection';
import HeroSection from '../../components/discoverAbuDhabi/HeroSection';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export function DiscoverAbuDhabi() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <GrowthAreasSection />
        <DirectorySection />
      </main>
      <Footer />
    </>
  );
}
