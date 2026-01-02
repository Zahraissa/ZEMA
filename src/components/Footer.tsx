import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faWhatsapp,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import {
    Bell,
    LogOut,
    Megaphone,
    Plus,
    Search,
    Settings,
    User,
    X,
    Sparkles, Facebook, Twitter, Instagram, Linkedin,
} from "lucide-react";
import { FaYoutubeSquare } from "react-icons/fa";
import { useLanguage } from "./LanguageContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { setLang } = useLanguage();

  const handleNewsletterSubmit = () => {
    console.log("Newsletter email:", email);
    setEmail("");
  };

  const changeLanguage = (lang: string) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [isVisible, setIsVisible] = useState(true);

  return (
    <footer className="relative bg-green-500 text-white overflow-hidden">
      {/* Minimal grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="container mx-auto px-4 relative z-10 pt-16 pb-8">

        {/* Widgets Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/*/!* About Widget *!/*/}
          {/*<div className="sm:col-span-2 lg:col-span-1">*/}
          {/*  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300">*/}
          {/*    <h3 className="text-xl font-light mb-4 text-blue-100">*/}
          {/*      Kuhusu eGAZ*/}
          {/*    </h3>*/}
          {/*    <p className="text-blue-300 mb-6 text-base leading-relaxed">*/}
          {/*      Mamlaka ya Serikali Mtandao Zanzibar (eGAZ) inatoa huduma bora za*/}
          {/*      serikali kupitia teknolojia ya kisasa kwa ajili ya maendeleo*/}
          {/*      endelevu.*/}
          {/*    </p>*/}
          {/*    <div className="flex space-x-4">*/}
          {/*      {[*/}
          {/*        {*/}
          {/*          icon: faFacebookF,*/}
          {/*          href: "https://web.facebook.com/egazanzibar?_rdc=1&_rdr#",*/}
          {/*        },*/}
          {/*        { icon: faYoutube, href: "https://www.youtube.com/@eGAZtv" },*/}
          {/*        {*/}
          {/*          icon: faInstagram,*/}
          {/*          href: "https://www.instagram.com/ega_zanzibar/",*/}
          {/*        },*/}
          {/*      ].map((social, index) => (*/}
          {/*        <a*/}
          {/*          key={index}*/}
          {/*          href={social.href}*/}
          {/*          className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-blue-600/50 transition-all duration-300 hover:scale-110 border border-blue-500/30"*/}
          {/*        >*/}
          {/*          <FontAwesomeIcon*/}
          {/*            icon={social.icon}*/}
          {/*            className="h-5 w-5 text-blue-200"*/}
          {/*          />*/}
          {/*        </a>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* Useful Links Widget */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <h3 className="text-xl font-light mb-6 text-white">
              Viungo Muhimu
            </h3>
            <ul className="space-y-3">
              {[
                { text: "Nyumbani", href: "/" },
                { text: "Kuhusu Sisi", href: "/about" },
                { text: "Huduma Zetu", href: "/services" },
                { text: "Sheria na Kanuni", href: "/contact" },
                { text: "Habari na Media", href: "/news" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white hover:text-blue-100 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:bg-blue-400 group-hover:scale-125 transition-transform"></div>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Widget */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <h3 className="text-xl font-light mb-6 text-white">
              Huduma Zetu
            </h3>
            <ul className="space-y-3">
              {[
                { text: "UI/UX Design", href: "/services" },
                { text: "Web Design", href: "/services" },
                { text: "System Development", href: "/services" },
                { text: "Training", href: "/services" },
                { text: "Hosting Services", href: "/services" },
              ].map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-white hover:text-blue-100 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:bg-blue-400 group-hover:scale-125 transition-transform"></div>
                    {service.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Widget */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <h3 className="text-xl font-light mb-6 text-white">
              Wasiliana Nasi
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mt-1 border border-blue-100">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-white h-4 w-4"
                  />
                </div>
                <div>
                  <p className="text-white text-base font-medium">
                    Location
                  </p>
                  <p className="text-blue-100 text-sm">
                    Zanzibar, Tanzania
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mt-1 border border-blue-100">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-white h-4 w-4"
                  />
                </div>
                <div>
                    <p className="text-white text-base font-medium">
                        Hotline
                    </p>
                  <p className="text-blue-100 text-base font-medium">
                      +255 776 942 258
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mt-1 border border-blue-100">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-white h-4 w-4"
                  />
                </div>
                <div>
                  <p className="text-white text-base font-medium">
                      Email Us
                  </p>
                  <p className="text-blue-100 text-sm">
                      info@blrasmz.go.tz
                  </p>
                </div>
              </div>
            </div>
          </div></div>

          {/*social links*/}
          <div className="row-start-1 flex items-center space-x-4 p-3">
              <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                  <Facebook className="w-5 h-5" />
              </a>

              <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-blue-400 hover:text-white transition-all duration-300"
              >
                  <Twitter className="w-5 h-5" />
              </a>

              <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                  <Instagram className="w-5 h-5" />
              </a>

              <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-blue-700 hover:text-white transition-all duration-300"
              >
                  <Linkedin className="w-5 h-5" />
              </a>
          </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-600/30 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-white text-sm">
                Copyright © {new Date().getFullYear()}, Developed & Maintained
                by eGAZ
              </p>
            </div>
            <div className="flex space-x-6">
              {[
                { text: "Terms", href: "/terms" },
                { text: "Policy", href: "/privacy" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Extra buttons appear when open */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible
            ? "opacity-100 max-h-96 tranblue-y-0"
            : "opacity-0 max-h-0 -tranblue-y-2"
            }`}
        >
          <div className="flex flex-col items-end space-y-3 mb-2">

            <Button
              size="icon"
              onClick={() => {
                setLang("sw");
                changeLanguage("sw");
              }}
              className="rounded-2xl bg-blue-400 hover:bg-green-500 backdrop-blur-lg text-white shadow-lg border border-amber-500/30 transition-all hover:scale-105"
            >
              🇹🇿
            </Button>
            <Button
              size="icon"
              onClick={() => {
                changeLanguage("en");
                setLang("en");
              }}
              className="rounded-2xl bg-blue-400 hover:bg-green-600/80 backdrop-blur-lg text-white  shadow-lg border border-blue-500/30 transition-all hover:scale-105"
            >
              ENG
            </Button>
          </div>
        </div>
        <Button
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="rounded-2xl bg-blue-400 hover:bg-green-600/80 text-white transition-all transform hover:scale-110 backdrop-blur-lg"
        >
          {isVisible ? (
            <X className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>

        
      </div>

      {/* Top wave decoration - more subtle */}
      <div className="absolute top-0 left-0 right-0 transform -tranblue-y-1">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 15C120 30 240 60 360 60C480 60 600 30 720 15C840 0 960 0 1080 7.5C1200 15 1320 30 1380 37.5L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="url(#footerGradient)" />
          <defs>
            <linearGradient id="footerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(248 250 252)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(248 250 252)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;