import { createBrowserRouter } from "react-router-dom";
import Index from "./(site)/pages/Index";
import About from "./(site)/pages/About";
import Services from "./(site)/pages/Services";
import Contact from "./(site)/pages/Contact";
import BoardMembers from "./(site)/pages/BoardMembers";
import DirectorGeneral from "./(site)/pages/DirectorGeneral";
import News from "./(site)/pages/News";
import NewsDetails from "./(site)/pages/NewsDetails";
import ServiceDetails from "./(site)/pages/ServiceDetails";
import Gallery from "./(site)/pages/Gallery";
import Website from "./(site)/pages/Website";
import FAQs from "./(site)/pages/FAQs";
import WhatWeDo from "./(site)/pages/What-we-do";
import Guidelines from "./(site)/pages/Guidelines";
import GuidelinesPage from "./(site)/pages/GuidelinesPage";
import NotFound from "./(site)/pages/NotFound";
import Login from "./cms/pages/Login";
import Dashboard from "./cms/pages/Dashboard";
import BandManagement from "./cms/pages/BandManagement";
import AddMember from "./cms/pages/AddMember";
import EditMember from "./cms/pages/EditMember";
import AboutManagement from "./cms/pages/AboutManagement";
import SliderManagement from "./cms/pages/SliderManagement";
import AddSlider from "./cms/pages/AddSlider";
import EditSlider from "./cms/pages/EditSlider";
import AddContent from "./cms/pages/AddContent";
import CreateArticle from "./cms/pages/CreateArticle";
import EditArticle from "./cms/pages/EditArticle";
import AddService from "./cms/pages/AddService";
import EditService from "./cms/pages/EditService";
import ServicesManagement from "./cms/pages/ServicesManagement";
import NewsManagement from "./cms/pages/NewsManagement";
import UserManagement from "./cms/pages/UserManagement";
import AddUser from "./cms/pages/AddUser";
import EditUser from "./cms/pages/EditUser";
import RoleManagement from "./cms/pages/RoleManagement";
import PermissionManagement from "./cms/pages/PermissionManagement";
import AddPermission from "./cms/pages/AddPermission";
import UserRoleAssignment from "./cms/pages/UserRoleAssignment";
import ProfileSettings from "./cms/pages/ProfileSettings";
import AccountManagement from "./cms/pages/AccountManagement";
import MenuManagement from "./cms/pages/MenuManagement";
import CreateMenu from "./cms/pages/CreateMenu";
import EditMenu from "./cms/pages/EditMenu";
import MenuEditor from "./cms/pages/MenuEditor";
import GuideManagement from "./cms/pages/GuideManagement";
import WelcomeMessageManagement from "./cms/pages/WelcomeMessageManagement";
import BrandManagement from "./cms/pages/BrandManagement";
import AddBrand from "./cms/pages/AddBrand";
import EditBrand from "./cms/pages/EditBrand";
import FAQsManagement from "./cms/pages/FAQsManagement";
import GalleryManagement from "./cms/pages/GalleryManagement";
import WebsiteServiceManagement from "./cms/pages/WebsiteServiceManagement";
import DirectorGeneralManagement from "./cms/pages/DirectorGeneralManagement";
import AuthorityFunctionsManagement from "./cms/pages/AuthorityFunctionsManagement";
import ContactManagement from "./cms/pages/ContactManagement";
import AddAboutContent from "./cms/pages/AddAboutContent";
import EditAboutContent from "./cms/pages/EditAboutContent";
import MuhimuManagement from "./cms/pages/MuhimuManagement";
import GuidelinesManagement from "./cms/pages/GuidelinesManagement";
import GuidelinesManagementNew from "./cms/pages/GuidelinesManagementNew";
import GuidelinesDashboard from "./cms/pages/GuidelinesDashboard";
import PolicyGuidelinesManagement from "./cms/pages/PolicyGuidelinesManagement";
import GuidelinesStandardsManagement from "./cms/pages/GuidelinesStandardsManagement";
import SamplesTemplatesManagement from "./cms/pages/SamplesTemplatesManagement";
import AddPolicyGuideline from "./cms/pages/AddPolicyGuideline";
import EditPolicyGuideline from "./cms/pages/EditPolicyGuideline";
import TestAPI from "./cms/pages/TestAPI";
import DebugAPI from "./cms/pages/DebugAPI";
import AddGuideline from "./cms/pages/AddGuideline";
import ViwangoNaMiongo from "./cms/pages/ViwangoNaMiongo";
import ViwangoNaMiongoPage from "./(site)/pages/ViwangoNaMiongoPage";
import SampleTemplatesPage from "./(site)/pages/SampleTemplatesPage";
import OrodhaViwangoMiongozoPage from "./(site)/pages/OrodhaViwangoMiongozoPage";
import ViwangoNaMiongozoManagement from "./cms/pages/ViwangoNaMiongozoManagement";
import AddStandard from "./cms/pages/AddStandard";
import EditStandard from "./cms/pages/EditStandard";
import AddSampleTemplate from "./cms/pages/AddSampleTemplate";
import AddSampuli from "./cms/pages/AddSampuli";
import ManageSampuli from "./cms/pages/ManageSampuli";
import EditSampuli from "./cms/pages/EditSampuli";
import AddViwango from "./cms/pages/AddViwango";
import ManageViwango from "./cms/pages/ManageViwango";
import EditViwango from "./cms/pages/EditViwango";
import AddOrodha from "./cms/pages/AddOrodha";
import ManageOrodha from "./cms/pages/ManageOrodha";
import EditOrodha from "./cms/pages/EditOrodha";
import { CMSLayout } from "./components/CMSLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import RegulationIntroduction from "@/(site)/pages/RegulationIntroduction.tsx";
import LicenceCriteria from "@/(site)/pages/LicenceCriteria.tsx";
import RightObligation from "@/(site)/pages/RightObligation.tsx";
import AccountabilityLA from "@/(site)/pages/AccountabilityLA.tsx";
import AppealMechanism from "@/(site)/pages/AppealMechanism.tsx";
import DutyOfLicencee from "@/(site)/pages/DutyOfLicencee.tsx";

export const router = createBrowserRouter([
    // Public website routes
    {
        path: "/",
        element: <Index />,
    },
    {
        path: "/about",
        element: <About />,
    },
    {
        path: "/introduction",
        element: <RegulationIntroduction />,
    },
    {
        path: "/accountability-LA",
        element: <AccountabilityLA />,
    },
    {
        path: "/duty-lisencee",
        element: <DutyOfLicencee />,
    },
    {
        path: "/appeal-mechanism",
        element: <AppealMechanism />,
    },
    {
        path: "/services",
        element: <Services />,
    },
    {
        path: "/services/:id",
        element: <ServiceDetails />,
    },
    {
        path: "/contact",
        element: <Contact />,
    },
    {
        path: "/criteria",
        element: <LicenceCriteria />,
    },
    {
        path: "/right-obligation",
        element: <RightObligation />,
    },
    {
        path: "/board-members",
        element: <BoardMembers />,
    },
    {
        path: "/director-general",
        element: <DirectorGeneral />,
    },
    {
        path: "/news",
        element: <News />,
    },
    {
        path: "/news/:id",
        element: <NewsDetails />,
    },
    {
        path: "/gallery",
        element: <Gallery />,
    },
    {
        path: "/website",
        element: <Website />,
    },
    {
        path: "/faqs",
        element: <FAQs />,
    },
    {
        path: "/what-we-do",
        element: <WhatWeDo />,
    },
    {
        path: "/guidelines",
        element: <Guidelines />,
    },
    {
        path: "/miogozo-ya-kisera",
        element: <GuidelinesPage />,
    },
    {
        path: "/viwango-na-miongo",
        element: <ViwangoNaMiongoPage />,
    },
    {
        path: "/mifumo-na-mfano",
        element: <SampleTemplatesPage />,
    },
    {
        path: "/orodha-ya-viwango-na-miongozo",
        element: <OrodhaViwangoMiongozoPage />,
    },
    {
        path: '/login',
        element: <Login />
    },
    // Protected CMS routes
    {
        path: '/cms',
        element: (
            <ProtectedRoute>
                <CMSLayout />
            </ProtectedRoute>
        ),
        errorElement: <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                <p className="text-muted-foreground mb-4">Please refresh the page or contact support.</p>
                <a href="/login" className="text-primary hover:underline">Go to Login</a>
            </div>
        </div>,
        children: [
            {
                path: '',
                element: <Dashboard />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'band',
                element: <BandManagement />
            },
            {
                path: 'add-member',
                element: <AddMember />
            },
            {
                path: 'edit-member/:id',
                element: <EditMember />
            },
            {
                path: 'about',
                element: <AboutManagement />
            },
            {
                path: 'add-about-content',
                element: <AddAboutContent />
            },
            {
                path: 'edit-about-content/:id',
                element: <EditAboutContent />
            },
            {
                path: 'sliders',
                element: <SliderManagement />
            },
            {
                path: 'add-slider',
                element: <AddSlider />
            },
            {
                path: 'edit-slider/:id',
                element: <EditSlider />
            },
            {
                path: 'add-content',
                element: <AddContent />
            },
            {
                path: 'create-article',
                element: <CreateArticle />
            },
            {
                path: 'edit-article/:id',
                element: <EditArticle />
            },
            {
                path: 'add-service',
                element: <AddService />
            },
            {
                path: 'edit-service/:id',
                element: <EditService />
            },
            {
                path: 'services',
                element: <ServicesManagement />
            },
            {
                path: 'news',
                element: <NewsManagement />
            },
            {
                path: 'users',
                element: <UserManagement />
            },
            {
                path: 'add-user',
                element: <AddUser />
            },
            {
                path: 'edit-user/:id',
                element: <EditUser />
            },
            {
                path: 'roles',
                element: <RoleManagement />
            },
            {
                path: 'permissions',
                element: <PermissionManagement />
            },
            {
                path: 'add-permission',
                element: <AddPermission />
            },
            {
                path: 'user-role-assignment',
                element: <UserRoleAssignment />
            },
            {
                path: 'profile',
                element: <ProfileSettings />
            },
            {
                path: 'account',
                element: <AccountManagement />
            },
            {
                path: 'menu',
                element: <MenuManagement />
            },
            {
                path: 'create-menu',
                element: <CreateMenu />
            },
            {
                path: 'edit-menu/:id',
                element: <EditMenu />
            },
            {
                path: 'menu-editor/:id',
                element: <MenuEditor />
            },
            {
                path: 'guides',
                element: <GuideManagement />
            },
            {
                path: 'welcome-messages',
                element: <WelcomeMessageManagement />
            },
            {
                path: 'brands',
                element: <BrandManagement />
            },
            {
                path: 'add-brand',
                element: <AddBrand />
            },
            {
                path: 'edit-brand/:id',
                element: <EditBrand />
            },
            {
                path: 'faqs',
                element: <FAQsManagement />
            },
            {
                path: 'gallery',
                element: <GalleryManagement />
            },
            {
                path: 'website-services',
                element: <WebsiteServiceManagement />
            },
            {
                path: 'director-general',
                element: <DirectorGeneralManagement />
            },
            {
                path: 'authority-functions',
                element: <AuthorityFunctionsManagement />
            },
            {
                path: 'contact',
                element: <ContactManagement />
            },
            {
                path: 'muhimu',
                element: <MuhimuManagement />
            },
            {
                path: 'guidelines',
                element: <GuidelinesDashboard />
            },
            {
                path: 'policy-guidelines',
                element: <PolicyGuidelinesManagement />
            },
            {
                path: 'guidelines-standards',
                element: <GuidelinesStandardsManagement />
            },
            {
                path: 'samples-templates',
                element: <SamplesTemplatesManagement />
            },
            {
                path: 'add-policy-guideline',
                element: <AddPolicyGuideline />
            },
            {
                path: 'edit-policy-guideline/:id',
                element: <EditPolicyGuideline />
            },
            {
                path: 'test-api',
                element: <TestAPI />
            },
            {
                path: 'debug-api',
                element: <DebugAPI />
            },
            {
                path: 'add-guideline',
                element: <AddGuideline />
            },
            {
                path: 'viwango-na-miongo',
                element: <ViwangoNaMiongo />
            },
            {
                path: 'viwango-na-miongozo',
                element: <ViwangoNaMiongozoManagement />
            },
            {
                path: 'add-standard',
                element: <AddStandard />
            },
            {
                path: 'edit-standard/:id',
                element: <EditStandard />
            },
            {
                path: 'add-sample-template',
                element: <AddSampleTemplate />
            },
            {
                path: 'add-sampuli',
                element: <AddSampuli />
            },
            {
                path: 'manage-sampuli',
                element: <ManageSampuli />
            },
            {
                path: 'edit-sampuli/:id',
                element: <EditSampuli />
            },
            {
                path: 'add-viwango',
                element: <AddViwango />
            },
            {
                path: 'manage-viwango',
                element: <ManageViwango />
            },
            {
                path: 'edit-viwango/:id',
                element: <EditViwango />
            },
            {
                path: 'add-orodha',
                element: <AddOrodha />
            },
            {
                path: 'manage-orodha',
                element: <ManageOrodha />
            },
            {
                path: 'edit-orodha/:id',
                element: <EditOrodha />
            }
        ]
    },
    // Catch-all route for 404
    {
        path: "*",
        element: <NotFound />
    }
])