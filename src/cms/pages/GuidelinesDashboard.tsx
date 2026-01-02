import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  FileCode, 
  Plus, 
  Settings, 
  Users,
  BarChart3,
  Shield,
  Building,
  Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GuidelinesDashboard: React.FC = () => {
  const navigate = useNavigate();

  const guidelineTypes = [
    {
      title: "Policy Guidelines",
      description: "Miongozo ya Sera - Hifadhi na udhibiti miongozo ya sera bila vikundi",
      icon: Shield,
      color: "bg-blue-500",
      route: "/cms/policy-guidelines",
      features: [
        "Miongozo ya sera bila vikundi",
        "Hifadhi miongozo ya sera",
        "Udhibiti viwango vya utekelezaji",
        "Tarehe za kuanza na kukagua"
      ],
      stats: {
        total: 24,
        active: 18,
        draft: 4,
        archived: 2
      }
    },
    {
      title: "Guidelines and Standards",
      description: "Miongozo na Viwango - Imepangwa katika vikundi na kila kikundi kina orodha yake ya nyaraka",
      icon: Building,
      color: "bg-green-500",
      route: "/cms/guidelines-standards",
      features: [
        "Vikundi vya miongozo na viwango",
        "Aina za viwango (Architecture, Security, nk)",
        "Viashiria vya ukomavu",
        "Upeo wa matumizi"
      ],
      groups: [
        "Application Architecture",
        "Architecture Processes And Governance",
        "Architecture Vision",
        "Business Architecture",
        "E-government Interoperability Framework",
        "Information Architecture",
        "Infrastructure Architecture",
        "Integration Architecture",
        "Security Architecture"
      ],
      stats: {
        total: 156,
        active: 142,
        draft: 10,
        archived: 4,
        groups: 9
      }
    },
    {
      title: "Samples and Templates",
      description: "Sampuli na Vigezo - Hifadhi na udhibiti sampuli na vigezo bila vikundi",
      icon: FileCode,
      color: "bg-purple-500",
      route: "/cms/samples-templates",
      features: [
        "Sampuli na vigezo bila vikundi",
        "Kategoria za vigezo",
        "Viashiria vya ugumu",
        "Muda unaokadiriwa na sharti"
      ],
      stats: {
        total: 89,
        active: 76,
        draft: 8,
        archived: 5
      }
    }
  ];

  const quickActions = [
    {
      title: "Ongeza Miongozo ya Sera",
      description: "Ongeza miongozo mpya ya sera",
      icon: Plus,
      route: "/cms/add-policy-guideline",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Ongeza Kikundi",
      description: "Ongeza kikundi kipya cha miongozo",
      icon: Plus,
      route: "/cms/add-guidelines-group",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Ongeza Miongozo na Viwango",
      description: "Ongeza miongozo na viwango vipya",
      icon: Plus,
      route: "/cms/add-guideline-standard",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Ongeza Sampuli na Vigezo",
      description: "Ongeza sampuli na vigezo vipya",
      icon: Plus,
      route: "/cms/add-sample-template",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const recentActivity = [
    {
      type: "Policy Guideline",
      action: "Imeongezwa",
      title: "Miongozo ya Usalama wa Mtandao",
      time: "2 masaa yaliyopita",
      user: "John Doe"
    },
    {
      type: "Guideline Standard",
      action: "Imehifadhiwa",
      title: "Viwango vya Usanifu wa Programu",
      time: "4 masaa yaliyopita",
      user: "Jane Smith"
    },
    {
      type: "Sample Template",
      action: "Imehifadhiwa",
      title: "Kigezo cha Uwasilishaji wa Ripoti",
      time: "6 masaa yaliyopita",
      user: "Mike Johnson"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">Usimamizi wa Miongozo na Viwango</h1>
          <p className="text-gray-600 mt-2">
            Dhibiti miongozo ya sera, miongozo na viwango, sampuli na vigezo vya e-Government Authority
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/cms/guidelines-settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Mipangilio
          </Button>
          <Button variant="outline" onClick={() => navigate('/cms/guidelines-analytics')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Uchambuzi
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-600">Jumla ya Nyaraka</p>
                <p className="text-2xl font-normal text-gray-900">269</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-600">Vikundi</p>
                <p className="text-2xl font-normal text-gray-900">9</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-600">Zinazotumika</p>
                <p className="text-2xl font-normal text-gray-900">236</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-600">Rasimu</p>
                <p className="text-2xl font-normal text-gray-900">22</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Guidelines Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {guidelineTypes.map((type, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {type.stats.total} nyaraka
                </Badge>
              </div>
              <CardTitle className="text-xl mt-4">{type.title}</CardTitle>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="font-normal text-gray-900 mb-2">Vipengele:</h4>
                <ul className="space-y-1">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Groups for Guidelines and Standards */}
              {type.groups && (
                <div>
                  <h4 className="font-normal text-gray-900 mb-2">Vikundi:</h4>
                  <div className="flex flex-wrap gap-1">
                    {type.groups.map((group, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Zinazotumika</p>
                    <p className="font-normal text-green-600">{type.stats.active}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rasimu</p>
                    <p className="font-normal text-yellow-600">{type.stats.draft}</p>
                  </div>
                  {type.stats.groups && (
                    <>
                      <div>
                        <p className="text-gray-600">Vikundi</p>
                        <p className="font-normal text-blue-600">{type.stats.groups}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Zilizohifadhiwa</p>
                        <p className="font-normal text-gray-600">{type.stats.archived}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate(type.route)}
              >
                Dhibiti {type.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Vitendo vya Haraka
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center text-center"
                onClick={() => navigate(action.route)}
              >
                <action.icon className="w-8 h-8 mb-2 text-gray-600" />
                <span className="font-normal">{action.title}</span>
                <span className="text-sm text-gray-500 mt-1">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Shughuli za Hivi Karibuni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-normal text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">
                      {activity.type} • {activity.action} na {activity.user}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidelinesDashboard;
