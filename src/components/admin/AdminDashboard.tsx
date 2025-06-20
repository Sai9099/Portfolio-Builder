import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import PersonalInfoEditor from './editors/PersonalInfoEditor';
import AboutEditor from './editors/AboutEditor';
import SkillsEditor from './editors/SkillsEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import ThemeEditor from './editors/ThemeEditor';
import PortfolioPreview from './PortfolioPreview';
import { Menu, X, Eye, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPortfolio, portfolios, setCurrentPortfolio } = usePortfolio();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    if (id) {
      const foundPortfolio = getPortfolio(id);
      if (foundPortfolio) {
        setPortfolio(foundPortfolio);
        setCurrentPortfolio(foundPortfolio);
      } else {
        navigate('/admin');
      }
    } else if (portfolios.length > 0) {
      // If no ID specified, use the first portfolio
      const firstPortfolio = portfolios[0];
      setPortfolio(firstPortfolio);
      setCurrentPortfolio(firstPortfolio);
      navigate(`/admin/portfolio/${firstPortfolio.id}`, { replace: true });
    }
  }, [id, portfolios, getPortfolio, setCurrentPortfolio, navigate]);

  const handleSave = () => {
    toast.success('Portfolio saved successfully!');
  };

  const renderEditor = () => {
    if (!portfolio) return null;

    switch (activeSection) {
      case 'personal':
        return <PersonalInfoEditor portfolio={portfolio} />;
      case 'about':
        return <AboutEditor portfolio={portfolio} />;
      case 'skills':
        return <SkillsEditor portfolio={portfolio} />;
      case 'projects':
        return <ProjectsEditor portfolio={portfolio} />;
      case 'theme':
        return <ThemeEditor portfolio={portfolio} />;
      default:
        return <PersonalInfoEditor portfolio={portfolio} />;
    }
  };

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (previewMode) {
    return <PortfolioPreview portfolio={portfolio} onClose={() => setPreviewMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Portfolio Editor - {portfolio.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            {renderEditor()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;