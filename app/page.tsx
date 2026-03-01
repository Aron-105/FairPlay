import HeroSection from "@/components/ui/HeroSection";
import Instructions1 from "@/components/features/Instructions1";
import FileUpload from "@/components/features/FileUpload";
import HowToExport from "@/components/features/HowToExport";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <HeroSection />
      <Instructions1 />
      <HowToExport />
      <FileUpload />
    </main>
  );
}