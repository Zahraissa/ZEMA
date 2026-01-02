import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, MapPin, FileText, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: MapPin,
      number: "4.99",
      label: "Miradi ya mikoa yaliyokamilika",
      trend: "+12%",
      color: "text-blue-600",
    },
    {
      icon: Users,
      number: "26,677",
      label: "Viongozi wa mikoa",
      trend: "+8%",
      color: "text-green-600",
    },
    {
      icon: FileText,
      number: "36,314",
      label: "Hati zilizokamilika",
      trend: "+15%",
      color: "text-purple-600",
    },
    {
      icon: Award,
      number: "1,152",
      label: "Shida za Mtaa",
      trend: "+5%",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      number: "4.03",
      label: "Hali ya kimataifa wa mafanikio",
      trend: "+3%",
      color: "text-red-600",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1 h-8 bg-primary"></div>
            <h2 className="text-3xl font-normal text-foreground">Takwimu ZETU</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tokomeza ndutumao za kifunga mpya ripoti ya kuandikisha maendeleo mapya na kazi za kimataifa zilizoweza kuratibu na mikoa makuu, na jamii za uongozi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-smooth cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 ${stat.color} group-hover:shadow-glow transition-smooth`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-normal text-foreground group-hover:text-primary transition-smooth">
                    {stat.number}
                  </div>
                  <p className="text-sm text-muted-foreground leading-tight">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Content */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-normal text-foreground mb-6">Matatgaizo Melimu</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <FileText className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-normal text-foreground">SERA/RASI ZA MPATANO WA SERIKALI: UZALISHAJI, UONGOZI NA UTENDAJI</h4>
                  <p className="text-muted-foreground text-sm mt-1">Ulinganishi kabla ya hotuba</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <Users className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-normal text-foreground">ORODHA YA JOSA NA NYARO HOJA KIJANGA YA SANITI</h4>
                  <p className="text-muted-foreground text-sm mt-1">Usharikishaji wa ukaaji</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-normal text-foreground mb-6">Video za Marufu</h3>
            <Card className="overflow-hidden group hover:shadow-elegant transition-smooth">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
                  alt="Video za Marufu"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-normal text-foreground">UTAZAJI WA SIKU & MAZIKO YA VIP ZETU</h4>
                <p className="text-muted-foreground text-sm mt-2">
                  Kuhusu mpango wa siku za mazingira na vipimo vya wafungwaji wasiojua mazingira na maongezi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;