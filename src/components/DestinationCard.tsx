import { Button } from "@/components/ui/button";

interface DestinationCardProps {
  title: string;
  country: string;
  description: string;
  image: string;
  onLearnMore: () => void;
}

const DestinationCard = ({ title, country, description, image, onLearnMore }: DestinationCardProps) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={`Beautiful view of ${title}, ${country}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-card-foreground mb-2">
          {title}
        </h3>
        <p className="text-elegant-gray font-medium mb-3">{country}</p>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        
        <Button 
          variant="travel" 
          onClick={onLearnMore}
          className="w-full"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default DestinationCard;