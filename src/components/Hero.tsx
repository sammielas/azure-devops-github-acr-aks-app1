import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-europe.jpg";

const Hero = () => {
  const scrollToDestinations = () => {
    const element = document.getElementById('destinations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/60"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Europe's
          <span className="block bg-gradient-to-r from-sunset-orange to-yellow-300 bg-clip-text text-transparent">
            Hidden Gems
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white/90 max-w-2xl mx-auto">
          From ancient cobblestone streets to breathtaking coastlines, embark on a journey through Europe's most enchanting destinations where every corner tells a story.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={scrollToDestinations}
            className="px-8 py-3 text-lg"
          >
            Explore Destinations
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary"
          >
            Plan Your Trip
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;