import DestinationCard from "./DestinationCard";
import santoriniImage from "@/assets/santorini.jpg";
import amalfiImage from "@/assets/amalfi.jpg";
import swissAlpsImage from "@/assets/swiss-alps.jpg";
import dubrovnikImage from "@/assets/dubrovnik.jpg";
import parisImage from "@/assets/paris.jpg";
import barcelonaImage from "@/assets/barcelona.jpg";

const destinations = [
  {
    id: 1,
    title: "Santorini",
    country: "Greece",
    description: "Experience the magic of whitewashed villages perched on volcanic cliffs, where blue-domed churches frame spectacular sunsets over the endless Aegean Sea.",
    image: santoriniImage,
  },
  {
    id: 2,
    title: "Amalfi Coast",
    country: "Italy",
    description: "Wind through dramatic coastal roads where colorful villages cascade down steep cliffs, offering breathtaking views of the Mediterranean and charming local culture.",
    image: amalfiImage,
  },
  {
    id: 3,
    title: "Swiss Alps",
    country: "Switzerland",
    description: "Discover pristine mountain peaks reflected in crystal-clear alpine lakes, surrounded by traditional chalets and meadows filled with wildflowers.",
    image: swissAlpsImage,
  },
  {
    id: 4,
    title: "Dubrovnik",
    country: "Croatia",
    description: "Walk through the ancient stone walls of this medieval fortress city, where red-tiled roofs meet the sparkling Adriatic in perfect harmony.",
    image: dubrovnikImage,
  },
  {
    id: 5,
    title: "Paris",
    country: "France",
    description: "Fall in love with the City of Light, where iconic landmarks, world-class cuisine, and romantic riverside walks create unforgettable memories.",
    image: parisImage,
  },
  {
    id: 6,
    title: "Barcelona",
    country: "Spain",
    description: "Immerse yourself in Gaudí's architectural wonders while enjoying vibrant tapas culture and Mediterranean beaches in this captivating Catalan capital.",
    image: barcelonaImage,
  },
];

const Destinations = () => {
  const handleLearnMore = (destinationTitle: string) => {
    // In a real app, this would navigate to a detailed destination page
    alert(`Learn more about ${destinationTitle} - Feature coming soon!`);
  };

  return (
    <section id="destinations" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Destinations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Carefully curated European destinations that promise extraordinary experiences, 
            rich cultural heritage, and memories that will last a lifetime.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              title={destination.title}
              country={destination.country}
              description={destination.description}
              image={destination.image}
              onLearnMore={() => handleLearnMore(destination.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;