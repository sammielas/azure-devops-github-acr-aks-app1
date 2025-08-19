const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-sunset-orange to-yellow-300 rounded-full"></div>
              <h3 className="text-2xl font-bold">EuroVista</h3>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Inspiring unforgettable European adventures through carefully curated destinations and authentic travel experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#home" className="hover:text-sunset-orange transition-colors">Home</a></li>
              <li><a href="#destinations" className="hover:text-sunset-orange transition-colors">Destinations</a></li>
              <li><a href="#about" className="hover:text-sunset-orange transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-sunset-orange transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* About Section */}
          <div className="text-center md:text-right" id="about">
            <h4 className="text-lg font-semibold mb-4">About EuroVista</h4>
            <p className="text-primary-foreground/80 leading-relaxed">
              We believe Europe's beauty lies in its diversity - from ancient traditions to modern innovations, 
              every destination offers a unique story waiting to be discovered.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 EuroVista. Made with ❤️ for travelers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;