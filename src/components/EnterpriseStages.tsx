import React, { useEffect, useState, useRef } from 'react'
import {
  Lightbulb,
  Code,
  Rocket,
  TrendingUp,
  BarChart3,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  CheckCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils'
// Stage popup component
interface StagePopupProps {
  stage: {
    id: string
    title: string
    description: string
    benefits: string[]
    icon: React.ReactNode
    ctaText: string
    path: string
    detailedDescription?: string
    services?: {
      title: string
      description: string
    }[]
  }
  onClose: () => void
  onCTAClick: () => void
}
const StagePopup: React.FC<StagePopupProps> = ({
  stage,
  onClose,
  onCTAClick,
}) => {
  // Prevent clicks inside the popup from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={handleContentClick}
      >
        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
                {stage.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {stage.title} Stage
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>
          </div>
          {/* Content */}
          <div className="p-6">
            {/* Detailed description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                About this stage
              </h4>
              <p className="text-gray-600">
                {stage.detailedDescription || stage.description}
              </p>
            </div>
            {/* Benefits */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Key Benefits
              </h4>
              <ul className="space-y-2">
                {stage.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Services */}
            {stage.services && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Available Services
                </h4>
                <div className="space-y-3">
                  {stage.services.map((service, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800">
                        {service.title}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* CTA Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onCTAClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 flex items-center"
              >
                {stage.ctaText}
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
interface StageCardProps {
  title: string
  description: string
  benefits: string[]
  icon: React.ReactNode
  ctaText: string
  onClick: () => void
  onShowDetails: () => void
  index: number
  activeIndex: number
  setActiveIndex: (index: number) => void
}
const StageCard: React.FC<StageCardProps> = ({
  title,
  description,
  benefits,
  icon,
  ctaText,
  onClick,
  onShowDetails,
  index,
  activeIndex,
  setActiveIndex,
}) => {
  const isActive = index === activeIndex
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 min-w-[300px] flex-shrink-0 md:min-w-0 relative ${isActive ? 'shadow-lg transform scale-105 md:scale-100 border-2 border-blue-500' : 'hover:shadow-lg hover:-translate-y-1'}`}
      onMouseEnter={() => setActiveIndex(index)}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div
            className={`p-3 rounded-full mr-4 transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Key Benefits:</h4>
          <ul className="text-gray-600 space-y-1">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start">
                <span
                  className={`mr-2 transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-blue-600'}`}
                >
                  •
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={(e) => {
            onShowDetails() // Button shows details popup
          }}
          className={`mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {ctaText}
          <ArrowRight
            size={16}
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
      {/* Stage number indicator */}
      <div
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
      >
        {index + 1}
      </div>
    </div>
  )
}
const EnterpriseStages: React.FC = () => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activePopup, setActivePopup] = useState<string | null>(null)
  // Scroll left/right controls
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      })
    }
  }
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      })
    }
  }
  // Animate timeline when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        threshold: 0.2,
      },
    )
    if (timelineRef.current) {
      observer.observe(timelineRef.current)
    }
    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current)
      }
    }
  }, [])
  const stages = [
    {
      id: 'ideation',
      title: 'Ideation',
      description: 'Transform your business idea into a viable concept',
      detailedDescription:
        'The Ideation stage is where your business journey begins. This crucial phase is all about developing and refining your business concept, validating market demand, and laying the groundwork for a successful venture. Our platform provides specialized tools and expert guidance to help you transform your ideas into viable business opportunities.',
      benefits: [
        'Idea validation workshops',
        'Market research support',
        'Business model canvas tools',
      ],
      icon: <Lightbulb size={24} className="transition-colors duration-300" />,
      ctaText: 'Start Your Idea',
      path: '/stages/ideation',
      services: [
        {
          title: 'Idea Validation Workshop',
          description:
            'Interactive sessions with industry experts to test and refine your business concept',
        },
        {
          title: 'Market Research Toolkit',
          description:
            'Access to comprehensive market analysis tools and data sources',
        },
        {
          title: 'Business Model Design',
          description:
            'Guided process to develop your business model canvas and value proposition',
        },
      ],
    },
    {
      id: 'launch',
      title: 'Launch',
      description: 'Set up and launch your business in Abu Dhabi swiftly',
      detailedDescription:
        'The Launch stage is where your business takes its first steps into the market. This phase involves establishing your legal entity, securing initial funding, setting up operations, and making your first sales. Our platform streamlines the launch process with dedicated support for business registration, licensing, and initial setup requirements specific to Abu Dhabi.',
      benefits: [
        'Business registration support',
        'Startup funding access',
        'Office space solutions',
      ],
      icon: <Rocket size={24} className="transition-colors duration-300" />,
      ctaText: 'Launch Your Business',
      path: '/stages/launch',
      services: [
        {
          title: 'Business Registration Fast-Track',
          description:
            'Streamlined process for registering your business in Abu Dhabi',
        },
        {
          title: 'Startup Funding Network',
          description:
            'Access to angel investors, seed funding, and early-stage grants',
        },
        {
          title: 'Workspace Solutions',
          description:
            'Flexible office space options from co-working to dedicated facilities',
        },
      ],
    },
    {
      id: 'growth',
      title: 'Growth',
      description: 'Scale your operations and expand your customer base',
      detailedDescription:
        "The Growth stage focuses on scaling your business operations, expanding your customer base, and increasing revenue. During this phase, you'll need to build efficient systems, develop your team, and implement effective marketing strategies. Our platform provides targeted resources to help you overcome growth challenges and capitalize on new opportunities.",
      benefits: [
        'Growth financing options',
        'Marketing & sales support',
        'Talent acquisition services',
      ],
      icon: <TrendingUp size={24} className="transition-colors duration-300" />,
      ctaText: 'Accelerate Growth',
      path: '/stages/growth',
      services: [
        {
          title: 'Growth Capital Solutions',
          description:
            'Specialized financing options for scaling businesses, including equity and debt',
        },
        {
          title: 'Marketing Acceleration Program',
          description:
            'Comprehensive marketing support to drive customer acquisition and retention',
        },
        {
          title: 'Talent Acquisition Services',
          description:
            'Recruitment assistance to build your team with the right skills and experience',
        },
      ],
    },
    {
      id: 'expansion',
      title: 'Expansion',
      description: 'Enter new markets and diversify your business',
      detailedDescription:
        'The Expansion stage is about taking your successful business model to new horizons. This might involve entering international markets, diversifying your product line, or expanding into new customer segments. Our platform offers specialized resources for market entry, strategic partnerships, and managing the complexities of a multi-market operation.',
      benefits: [
        'International market entry',
        'Product diversification',
        'Strategic partnerships',
      ],
      icon: <BarChart3 size={24} className="transition-colors duration-300" />,
      ctaText: 'Expand Your Reach',
      path: '/stages/expansion',
      services: [
        {
          title: 'Global Market Entry Program',
          description:
            'Specialized support for entering international markets with local expertise',
        },
        {
          title: 'Product Diversification Strategy',
          description:
            'Expert guidance on expanding your product or service offerings',
        },
        {
          title: 'Partnership & Alliance Development',
          description:
            'Facilitated connections with potential strategic partners and distributors',
        },
      ],
    },
    {
      id: 'optimization',
      title: 'Optimization',
      description: 'Streamline operations and maximize efficiency',
      detailedDescription:
        'The Optimization stage focuses on refining your business operations to enhance efficiency, reduce costs, and improve overall performance. This phase involves analyzing your current processes, identifying bottlenecks, and implementing solutions to streamline your business. Our platform provides tools and expertise to help you optimize every aspect of your operations.',
      benefits: [
        'Process optimization',
        'Technology integration',
        'Cost reduction strategies',
      ],
      icon: <Award size={24} className="transition-colors duration-300" />,
      ctaText: 'Optimize Operations',
      path: '/stages/optimization',
      services: [
        {
          title: 'Business Process Reengineering',
          description:
            'Expert analysis and redesign of core business processes for maximum efficiency',
        },
        {
          title: 'Technology Integration Solutions',
          description:
            'Implementation support for advanced business systems and automation',
        },
        {
          title: 'Cost Optimization Audit',
          description:
            'Comprehensive review of expenses with actionable cost reduction recommendations',
        },
      ],
    },
    {
      id: 'transformation',
      title: 'Transformation',
      description: 'Reinvent your business model for future growth',
      detailedDescription:
        'The Transformation stage is about reinventing your business to adapt to changing markets, technologies, and customer needs. This might involve digital transformation, sustainability integration, or complete business model innovation. Our platform supports your transformation journey with cutting-edge resources and expertise to help you stay ahead of industry disruptions.',
      benefits: [
        'Digital transformation',
        'Business model innovation',
        'Sustainability integration',
      ],
      icon: <Code size={24} className="transition-colors duration-300" />,
      ctaText: 'Transform Your Business',
      path: '/stages/transformation',
      services: [
        {
          title: 'Digital Transformation Roadmap',
          description:
            'Strategic planning and implementation support for digital transformation initiatives',
        },
        {
          title: 'Business Model Innovation Lab',
          description:
            'Collaborative workshops to redesign and future-proof your business model',
        },
        {
          title: 'Sustainability Integration Program',
          description:
            'Expert guidance on incorporating sustainable practices into your business operations',
        },
      ],
    },
  ]
  // Handle opening a popup
  const handleOpenPopup = (stageId: string) => {
    setActivePopup(stageId)
  }
  // Handle closing the popup
  const handleClosePopup = () => {
    setActivePopup(null)
  }
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Business Growth Journey
          </h2>
          <div className="relative">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find the right support for every stage of your business
              development
            </p>
          </div>
        </FadeInUpOnScroll>
        {/* Timeline connector (visible on desktop) */}
        <div
          ref={timelineRef}
          className="hidden lg:block relative max-w-6xl mx-auto h-2 bg-gray-200 rounded-full my-12"
        >
          <div
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isInView
                ? `${((activeIndex + 1) / stages.length) * 100}%`
                : '0%',
            }}
          ></div>
          {/* Stage markers */}
          {stages.map((_, index) => (
            <div
              key={index}
              className={`absolute top-0 transform -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500 ${index <= activeIndex ? 'bg-blue-500 border-2 border-white' : 'bg-gray-300'}`}
              style={{
                left: `calc(${(index / (stages.length - 1)) * 100}% - 12px)`,
                transform: 'translateY(-50%)',
                transition: 'background-color 0.5s ease-out',
              }}
              onClick={() => setActiveIndex(index)}
            ></div>
          ))}
        </div>
        {/* Scroll Controls - Desktop */}
        {/* <div className="hidden md:flex justify-end mb-4 space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div> */}
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {stages.map((stage, index) => (
            <HorizontalScrollReveal
              key={stage.id}
              direction={index % 2 === 0 ? 'left' : 'right'}
              distance={50}
              threshold={0.2}
            >
              <StageCard
                title={stage.title}
                description={stage.description}
                benefits={stage.benefits}
                icon={stage.icon}
                ctaText={stage.ctaText}
                onClick={() => navigate(stage.path)} // This is still needed for the component props
                onShowDetails={() => handleOpenPopup(stage.id)} // Button opens popup
                index={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </HorizontalScrollReveal>
          ))}
        </div>
        {/* Mobile Scroll Indicator */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="flex space-x-1">
            {stages.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full w-6 transition-all duration-300 ${index === activeIndex ? 'bg-blue-600 w-10' : 'bg-gray-300'}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to stage ${index + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Stage Popups */}
        {activePopup && (
          <StagePopup
            stage={stages.find((stage) => stage.id === activePopup)!}
            onClose={handleClosePopup}
            onCTAClick={() => {
              const stage = stages.find((stage) => stage.id === activePopup)!
              handleClosePopup()
              navigate(stage.path)
            }}
          />
        )}
      </div>
      {/* Add animations for popup */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
export default EnterpriseStages
