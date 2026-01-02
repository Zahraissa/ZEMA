import React, { useState, useEffect } from "react";
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
    Calendar,
    MapPin,
    Phone,
    Mail,
    Clock,
    Star,
    Building,
    Lightbulb,
    Heart,
    Zap,
    Settings,
    Headphones,
    Network,
    Eye,
    Award as AwardIcon,
    Users as UsersIcon,
    Handshake,
    Briefcase,
    GraduationCap, HomeIcon, InfoIcon, ClipboardCheck, FileCheck
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { publicAPI, AboutContent } from "@/services/api";
import {BsInfo} from "react-icons/bs";


interface AboutData {
    Licences: {
        title: string;
        description: string;
    };
    Permits: {
        title: string;
        description: string;
    };
    Principles: Array<{
        description: string;
    }>
}
const RegulationIntroduction = () => {

    const [aboutData] = useState<AboutData>({
        Licences: {
            title: "What is License",
            description: "Refer to legal permission from the government or other authorities to carry on some business or profession from the provision of any legislation",
        },
        Permits: {
            title: "What is Permit/Authorization ?",
            description: "means any approval, consent, license, permit, waiver, or other authorization issued, granted, given, or otherwise made available by or under the authority of any Governmental Body or pursuant to any Legal Requirement.",
        },
        Principles:[
            {
                description : "Legal mandate and its regulations supervising such business."
            },
            {
                description : "Uniform and simplification of procedures of issuance license"
            },
            {
                description : "Transparency in processing application."
            },
            {
                description : "Avoidance of bureaucratic inertia and discretion."
            },
            {
                description : "Effective, efficient and Low cost system."
            },
            {
                description : "Charged clearly fixed fees."
            },
            {
                description : "Requirements to hold licenses."
            },
            {
                description : "Description of services rendered."
            },
            {
                description : "Free from bribery and Corruption."
            },
            {
                description : "FAvoidance of imposing undue burdens on SME’s. "
            },
        ],
    });

    const getIconComponent = (iconName: string) => {
        const iconMap: Record<string, any> = {
            shield: Shield,
            lightbulb: Lightbulb,
            users: UsersIcon,
            handshake: Handshake,
            heart: Heart,
            award: AwardIcon,
            target: Target,
            eye: Eye,
            star: Star
        };
    };

    return (
        <div className="min-h-screen">
            <Header />

            {/* Enhanced Page Header */}
            <section className="relative bg-green-500 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">

                        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Regulatory System</h1>
                        <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                            <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                                <HomeIcon className="w-4 h-4 text-white" />
                                <span>Home</span>
                            </a>
                            <span>/</span>
                            <span className="text-white font-medium">introduction</span>
                        </nav>

                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Enhanced Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sticky top-8 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-600">
                                    <div className="p-2 bg-green-400 rounded-lg">
                                        <InfoIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-600">
                                        REGULATORY
                                    </h3>
                                </div>
                                <nav className="space-y-1">
                                    <a href="/introduction" className="block text-gray-800 font-bold bg-green-100 py-2 px-3 rounded-lg border-l-4 border-green-600">
                                        Introduction to licence
                                    </a>
                                    <a href="/criteria" className="block text-gray-600 hover:text-black hover:bg-green-100 transition-all py-2 hover:px-3 rounded-lg">
                                        Licence application
                                    </a>
                                    <a href="/right-obligation" className="block text-gray-600 hover:text-black hover:bg-green-100 transition-all py-2 hover:px-3 rounded-lg">
                                        Right And Obligation
                                    </a>
                                </nav>
                            </div>
                        </div>

                        {/* Enhanced Main Content Area */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-500 mb-6">License And Permit</h3>
                                    <div className="mb-8 rounded-xl p-6 border hover:border-green-500">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <FileCheck  className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                    {aboutData.Licences.title}
                                                </h4>
                                                <p>
                                                    {aboutData.Licences.description}
                                                </p>

                                            </div>

                                            <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <ClipboardCheck  className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                    {aboutData.Permits.title}
                                                </h4>
                                                <p>
                                                    {aboutData.Permits.description}
                                                </p>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Vision, Mission Section */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-500 mb-6">Principles for License/Permit/Authorization</h3>
                                        <h5 className="font-middle text-gray-500 mb-6">The licensing authorities are obliged to observe the following Principles Governing Licensing System while issuing business license, permits or other authorization</h5>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Vision */}
                                            {aboutData.Principles.map(item => (
                                                <Card className="border-2 hover:border-green-300 hover:shadow-xl transition-all">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="flex-1">
                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default RegulationIntroduction;

