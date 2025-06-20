import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Portfolio {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  data: PortfolioData;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    profileImage: string;
  };
  about: {
    description: string;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      description: string;
    }>;
    experience: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
    }>;
  };
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
  }>;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    layout: 'modern' | 'classic' | 'minimal';
  };
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  createPortfolio: (name: string) => Promise<string>;
  updatePortfolio: (id: string, data: Partial<PortfolioData>) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;
  getPortfolio: (id: string) => Portfolio | null;
  setCurrentPortfolio: (portfolio: Portfolio | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

const defaultPortfolioData: PortfolioData = {
  personal: {
    name: 'John Doe',
    title: 'Full-Stack Developer',
    bio: 'Passionate about creating beautiful, functional web experiences.',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  about: {
    description: 'With over 5 years of experience in web development, I specialize in creating modern, responsive applications.',
    education: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'University of Technology',
        year: '2016-2020',
        description: 'Focused on software engineering and web technologies.'
      }
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        period: '2022 - Present',
        description: 'Leading frontend development for enterprise applications.'
      }
    ]
  },
  skills: [
    { name: 'JavaScript', level: 90, category: 'Frontend' },
    { name: 'React', level: 85, category: 'Frontend' },
    { name: 'TypeScript', level: 80, category: 'Frontend' },
    { name: 'Node.js', level: 75, category: 'Backend' }
  ],
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React and Node.js.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['React', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#',
      featured: true
    }
  ],
  social: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    email: 'john.doe@example.com'
  },
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    darkMode: false,
    layout: 'modern'
  }
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    // Load portfolios from localStorage
    const savedPortfolios = localStorage.getItem('portfolios');
    if (savedPortfolios) {
      try {
        setPortfolios(JSON.parse(savedPortfolios));
      } catch (error) {
        console.error('Error loading portfolios:', error);
      }
    } else {
      // Create default portfolio
      const defaultPortfolio: Portfolio = {
        id: '1',
        name: 'Default Portfolio',
        slug: 'default',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: defaultPortfolioData
      };
      setPortfolios([defaultPortfolio]);
      localStorage.setItem('portfolios', JSON.stringify([defaultPortfolio]));
    }
  }, []);

  const createPortfolio = async (name: string): Promise<string> => {
    const id = Date.now().toString();
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newPortfolio: Portfolio = {
      id,
      name,
      slug,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { ...defaultPortfolioData }
    };

    const updatedPortfolios = [...portfolios, newPortfolio];
    setPortfolios(updatedPortfolios);
    localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    
    return id;
  };

  const updatePortfolio = async (id: string, data: Partial<PortfolioData>): Promise<void> => {
    const updatedPortfolios = portfolios.map(portfolio => {
      if (portfolio.id === id) {
        return {
          ...portfolio,
          data: { ...portfolio.data, ...data },
          updatedAt: new Date().toISOString()
        };
      }
      return portfolio;
    });

    setPortfolios(updatedPortfolios);
    localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    
    // Update current portfolio if it's the one being updated
    if (currentPortfolio?.id === id) {
      const updatedCurrent = updatedPortfolios.find(p => p.id === id);
      if (updatedCurrent) {
        setCurrentPortfolio(updatedCurrent);
      }
    }
  };

  const deletePortfolio = async (id: string): Promise<void> => {
    const updatedPortfolios = portfolios.filter(portfolio => portfolio.id !== id);
    setPortfolios(updatedPortfolios);
    localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    
    if (currentPortfolio?.id === id) {
      setCurrentPortfolio(null);
    }
  };

  const getPortfolio = (id: string): Portfolio | null => {
    return portfolios.find(portfolio => portfolio.id === id) || null;
  };

  return (
    <PortfolioContext.Provider value={{
      portfolios,
      currentPortfolio,
      createPortfolio,
      updatePortfolio,
      deletePortfolio,
      getPortfolio,
      setCurrentPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};