import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Eye, Edit, Trash2, Plus, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PortfolioList: React.FC = () => {
  const { portfolios, deletePortfolio, createPortfolio } = usePortfolio();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deletePortfolio(id);
        toast.success('Portfolio deleted successfully');
      } catch (error) {
        toast.error('Failed to delete portfolio');
      }
    }
  };

  const handleCreatePortfolio = async () => {
    const name = prompt('Enter portfolio name:');
    if (name && name.trim()) {
      try {
        const id = await createPortfolio(name.trim());
        toast.success('Portfolio created successfully!');
      } catch (error) {
        toast.error('Failed to create portfolio');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Portfolio <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CMS</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Create, manage, and showcase your professional portfolios
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleCreatePortfolio}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>Create New Portfolio</span>
            </button>
            
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600"
            >
              <Edit size={20} />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Portfolio Header */}
                <div 
                  className="h-32 relative"
                  style={{
                    background: `linear-gradient(135deg, ${portfolio.data.theme.primaryColor} 0%, ${portfolio.data.theme.secondaryColor} 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={portfolio.data.personal.profileImage}
                        alt={portfolio.data.personal.name}
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-lg">{portfolio.name}</h3>
                        <p className="text-white text-sm opacity-90">{portfolio.data.personal.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {portfolio.data.personal.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                      {portfolio.data.personal.bio}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {portfolio.data.projects.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {portfolio.data.skills.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Skills</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {portfolio.data.about.experience.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Experience</div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar size={12} className="mr-1" />
                    <span>Updated {format(new Date(portfolio.updatedAt), 'MMM dd, yyyy')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/portfolio/${portfolio.id}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </Link>
                    
                    <Link
                      to={`/admin/portfolio/${portfolio.id}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(portfolio.id, portfolio.name)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Portfolios Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create your first portfolio to get started
              </p>
              <button
                onClick={handleCreatePortfolio}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 mx-auto"
              >
                <Plus size={20} />
                <span>Create Portfolio</span>
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multiple Portfolios
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage multiple portfolios for different purposes or clients
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy Customization
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize colors, themes, and layouts with our intuitive admin panel
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Live Preview
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              See your changes in real-time with instant preview functionality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioList;