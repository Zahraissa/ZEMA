import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Target, 
  Globe, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  MapPin,
  Phone,
  Mail,
  Star,
  Lightbulb,
  Heart,
  Zap,
  Settings,
  Headphones,
  Network
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const AboutNew = () => {
  const stats = [
    { 
      icon: Users, 
      value: "500+", 
      label: "Wafanyakazi",
      description: "Timu yetu ya wataalamu"
    },
    { 
      icon: Award, 
      value: "25+", 
      label: "Miaka ya Uzoefu",
      description: "Uzoefu wa muda mrefu"
    },
    { 
      icon: Target, 
      value: "1000+", 
      label: "Miradi Kamili",
      description: "Miradi iliyomalizika"
    }, 
    { 
      icon: Globe, 
      value: "24/7", 
      label: "Huduma",
      description: "Msaada wa kila wakati"
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Ushirikiano",
      description: "Tunashirikiana na wananchi na washirika wetu kwa uaminifu na uwazi",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Lightbulb,
      title: "Ubunifu",
      description: "Tunatumia ubunifu na teknolojia ya kisasa kutatua changamoto",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Uaminifu",
      description: "Tunatumika kwa uaminifu na uwazi katika huduma zote",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Ufanisi",
      description: "Tunatoa huduma za ufanisi na ubora wa juu",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const achievements = [
    "Uboreshaji wa mifumo ya teknolojia ya habari",
    "Upanuzi wa huduma za mtandao wa serikali",
    "Mafanikio katika uwekezaji wa miundombinu",
    "Uboreshaji wa huduma kwa wananchi",
    "Mafanikio katika elimu ya teknolojia",
    "Upanuzi wa huduma za mtandao"
  ];

  const teamMembers = [
    {
      name: "Dkt. Samia Suluhu Hassan",
      position: "Rais wa Jamhuri ya Muungano wa Tanzania",
      image: "/assets/leader-portrait.jpg",
      description: "Mwenye uzoefu wa miaka 25 katika uongozi wa serikali"
    },
    {
      name: "Mheshimiwa Hussein Ali Mwinyi",
      position: "Rais wa Zanzibar na Mwenyekiti wa Baraza la Mapinduzi",
      image: "/assets/leader-portrait.jpg",
      description: "Mwenye ujuzi wa juu katika usimamizi wa miradi"
    }
  ];

  const aboutServices = [
    {
      icon: Settings,
      title: "Usimamizi wa Huduma za Teknolojia",
      description: "Tunatoa huduma kamili za usimamizi wa mifumo ya teknolojia ya habari"
    },
    {
      icon: Network,
      title: "Mtandao wa Ndani",
      description: "Tunajenga na kusimamia mitandao ya ndani ya serikali"
    },
    {
      icon: Headphones,
      title: "Msaada wa Mteja 24/7",
      description: "Tunatoa msaada wa mteja kwa masaa 24 kwa siku 7"
    }
  ];

  const processSteps = [
    {
      image: "/assets/service_bg_4.jpg",
      title: "Mipango",
      description: "Kutambua na kuunda vipengele muhimu vinavyoboresha utendaji wa mfumo",
      step: "01",
      icon: Target
    },
    {
      image: "/assets/leader-portrait.jpg",
      title: "Muundo na Utekelezaji",
      description: "Kufanya upya wa mfumo na data mpya kudumisha ufanisi",
      step: "02",
      icon: Settings
    },
    {
      image: "/assets/service_bg_4.jpg",
      title: "Ufuatiliaji",
      description: "Kuunganisha mfumo uliofunzwa katika jukwaa, programu, au mfumo",
      step: "03",
      icon: TrendingUp
    },
    {
      image: "/assets/leader-portrait.jpg",
      title: "Ripoti na Kujitoa",
      description: "Kuunganisha maoni ya watumiaji na matokeo ya mfumo kwa uboreshaji",
      step: "04",
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/hero_bg_6_1.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge 
              variant="secondary" 
              className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              Kuhusu Sisi
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight">
              Tunajenga
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                Siku za Kesho
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Mamlaka ya Serikali Mtandao Zanzibar - Kuleta teknolojia ya kisasa 
              na huduma bora kwa wananchi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                Jifunze Zaidi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Tazama Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm sm:text-base md:text-lg font-normal mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img 
                      src="/assets/leader-portrait.jpg" 
                      alt="About" 
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img 
                      src="/assets/service_bg_4.jpg" 
                      alt="About" 
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-blue-50 rounded-full w-16 h-16 p-0 shadow-xl hover:scale-110 transition-transform"
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-normal text-gray-900">25+ Miaka</div>
                    <div className="text-sm text-gray-600">Uzoefu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-600 border-blue-200">
                  Kuhusu Sisi
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6 leading-tight">
                  Fanya Uboreshaji Haraka, 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Kukuza Kwa Busara
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Mamlaka ya Serikali Mtandao Zanzibar inajishughulisha na kutoa suluhisho za teknolojia za ubunifu, 
                  zinazoweza kupanuka, na zilizobinafsishwa kusaidia serikali kujenga, kukua, na kufanikiwa 
                  katika soko la ushindani.
                </p>
              </div>

              {/* Services */}
              <div className="space-y-6">
                {aboutServices.map((service, index) => (
                  <div key={index} className="flex items-start space-x-4 group hover:bg-white/50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-normal text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Jifunze Zaidi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-600 border-blue-200">
              Thamani Zetu
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              Dhamira, Maono na Thamani Zetu
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tunafuata thamani muhimu zinazotuongoza katika kazi yetu ya kila siku
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Mission */}
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">Dhamira Yetu</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kuchukua teknolojia za kisasa kama kompyuta ya wingu, 
                  akili ya bandia (AI), uchambuzi wa data, automatization, na 
                  Internet of Things (IoT) kuboresha ufanisi, uzoefu wa wateja, 
                  na utendaji wa jumla wa biashara.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">Maono Yetu</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kuwa kiongozi wa kimataifa katika suluhisho za teknolojia za ubunifu, 
                  kuunda siku za kesho bora kwa wote kupitia teknolojia ya kisasa 
                  na huduma bora.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">Thamani Zetu</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ushirikiano, Ubunifu, Uaminifu, na Ufanisi - thamani hizi 
                  zinatuongoza katika kila hatua tunayochukua kutoa huduma bora 
                  kwa wananchi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-600 border-blue-200">
              Mchakato Wetu
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              Jinsi Mchakato Unavyofanya Kazi!
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tunafuata mchakato wa usimamizi wa ubora wa juu kuhakikisha matokeo bora
            </p>
          </div>
          
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, Pagination]}
            className="process-swiper"
          >
            {processSteps.map((step, index) => (
              <SwiperSlide key={index}>
                <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-xl bg-white overflow-hidden">
                  <div className="relative">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-normal shadow-lg">
                      STEP {step.step}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-normal text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              Thamani Zetu za Msingi
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tunafuata thamani muhimu zinazotuongoza katika kazi yetu ya kila siku
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-xl group">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-normal text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              Uongozi Wetu
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Viongozi wetu wenye uzoefu na ujuzi wa juu
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-xl group">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-normal mb-2">{member.name}</h3>
                    <p className="text-blue-200 text-lg mb-2">{member.position}</p>
                    <p className="text-gray-300 text-sm">{member.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-8">
                Mafanikio Yetu
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Tumeendelea kufikia malengo yetu na kuleta mabadiliko chanya 
                katika jamii yetu kwa miaka mingi.
              </p>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-4 group hover:bg-gray-50/50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-gray-700 text-lg group-hover:text-gray-900 transition-colors">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10 rounded-3xl text-white shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-normal mb-8">Tunafanya Nini</h3>
                <ul className="space-y-6">
                  <li className="flex items-center text-lg">
                    <CheckCircle className="h-6 w-6 mr-4 text-green-300 flex-shrink-0" />
                    Huduma za mtandao wa serikali
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="h-6 w-6 mr-4 text-green-300 flex-shrink-0" />
                    Uboreshaji wa mifumo ya teknolojia
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="h-6 w-6 mr-4 text-green-300 flex-shrink-0" />
                    Elimu ya teknolojia ya habari
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="h-6 w-6 mr-4 text-green-300 flex-shrink-0" />
                    Uwekezaji wa miundombinu
                  </li>
                  <li className="flex items-center text-lg">
                    <CheckCircle className="h-6 w-6 mr-4 text-green-300 flex-shrink-0" />
                    Huduma za usalama wa mtandao
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/hero_bg_6_1.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal mb-8">
            Wasiliana Nasi
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Kama una swali au unahitaji msaada, wasiliana nasi kupitia njia zifuatazo
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 group hover:bg-white/10 p-6 rounded-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-normal text-lg">Simu</div>
                <div className="text-blue-200 text-lg">+255 770 560 345</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 group hover:bg-white/10 p-6 rounded-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-normal text-lg">Barua Pepe</div>
                <div className="text-blue-200 text-lg">info@egaz.go.tz</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 group hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <div className="font-normal text-lg">Anwani</div>
                <div className="text-blue-200 text-lg">Ikulu Zanzibar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutNew;
