/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Calendar, 
  Cpu, 
  Users, 
  Zap, 
  ChevronRight, 
  Code, 
  BarChart3, 
  Brain, 
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIntersecting(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={index}
              className="absolute rounded-full bg-cyan-500"
              style={{
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.1,
                filter: 'blur(100px)',
                animation: `float ${Math.random() * 20 + 10}s infinite alternate ease-in-out`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={`transform transition-all duration-1000 ${isIntersecting ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="block">The Future of</span>
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">Event Management</span>
                </h1>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Reimagining the way events are planned, organized, and experienced
                  through the power of artificial intelligence.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-medium text-black shadow-lg transition-all duration-300 hover:shadow-cyan-500/30">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                  <button className="rounded-full bg-transparent border border-gray-700 px-8 py-4 font-medium text-white hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300">
                    <span className="flex items-center gap-2">
                      Learn More <ChevronRight size={18} />
                    </span>
                  </button>
                </div>
                
                <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-500"></span>
                    <p>5000+ Events</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <p>1M+ Attendees</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-500"></span>
                    <p>98% Satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div className={`relative transform transition-all duration-1000 delay-300 ${isIntersecting ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur-xl opacity-70 animate-pulse"></div>
                  <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-3xl p-1 border border-white/10">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <img
                        src="/placeholder.svg?height=600&width=800"
                        alt="AI Event Management"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Floating UI Elements */}
                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-cyan-500/20">
                          <Brain size={18} className="text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">AI Processing</div>
                          <div className="text-sm font-medium">98% Complete</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs text-gray-400">Event Optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating stat cards */}
                <div className="absolute -right-12 -bottom-12 bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <BarChart3 size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Engagement Rate</div>
                      <div className="text-sm font-medium">+46% Increase</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -left-12 top-1/4 bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg transform rotate-1 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Users size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Attendee Satisfaction</div>
                      <div className="text-sm font-medium">98% Positive</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
            <ChevronRight size={20} className="text-gray-500 transform rotate-90" />
          </div>
        </div>
      </section>

      {/* About Section with 3D Tilt Cards */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/50 text-cyan-400 text-sm font-medium mb-4">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              We're reimagining <span className="text-cyan-400">event</span> experiences
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Founded in 2025, we've combined AI technology with event expertise to create 
              a platform that makes event planning seamless and deeply personalized.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutCards.map((card, index) => (
              <div 
                key={index}
                className="group relative perspective"
              >
                <div className="relative preserve-3d transition-all duration-500 group-hover:-rotate-y-12 group-hover:-rotate-x-12">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-800 overflow-hidden group-hover:border-cyan-700 transition-all">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-xl"></div>
                    
                    <div className="relative flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-950 to-gray-900 rounded-xl flex items-center justify-center mb-6 border border-cyan-800/50">
                          <card.icon className="text-cyan-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
                        <span>{card.year}</span>
                        <div className="flex items-center gap-2 text-cyan-400">
                          <span>Learn more</span>
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Horizontal Scroll */}
      <section className="py-28 bg-gradient-to-b from-gray-950 to-black relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-950/50 text-blue-400 text-sm font-medium mb-4">
              Our Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How Our <span className="text-blue-400">AI</span> Transforms Events
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our cutting-edge AI technology powers every aspect of the event lifecycle,
              creating experiences that resonate with attendees.
            </p>
          </div>
          
          <div className="relative ">
            <div className="flex justify-center space-x-6 pb-8 overflow-x-auto hide-scrollbar">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex-shrink-0 w-80 ${index === activeSection ? 'opacity-100' : 'opacity-70'} transition-opacity duration-300`}
                  onMouseEnter={() => setActiveSection(index)}
                >
                  <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 hover:border-blue-700 transition-all duration-300 h-full">
                    <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-800/50 transition-colors">
                      <feature.icon className="text-cyan-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section with Animated UI */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/50 text-cyan-400 text-sm font-medium mb-4">
                AI-Powered
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our <span className="text-cyan-400">Core</span> Technology
              </h2>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                At the heart of our platform lies a sophisticated artificial intelligence system 
                trained on thousands of successful events. Our proprietary algorithms analyze patterns, 
                predict outcomes, and generate recommendations that ensure your event stands out.
              </p>

              <div className="space-y-8 mt-12">
                {techFeatures.map((tech, index) => (
                  <div key={index} className="group flex items-start gap-6 hover:bg-gray-900/30 p-4 rounded-xl transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-900/50 to-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-800/30 group-hover:border-cyan-600/50 transition-all duration-300">
                      <tech.icon className="text-cyan-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                        {tech.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Animated UI Graphic */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-70"></div>
                <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  {/* Animated Terminal */}
                  <div className="rounded-xl bg-black border border-gray-800 overflow-hidden mb-6">
                    <div className="bg-gray-900 px-4 py-2 flex items-center gap-2">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs text-gray-400 ml-2">eventai-terminal</div>
                    </div>
                    <div className="p-4 font-mono text-sm">
                      <div className="flex">
                        <span className="text-cyan-400">$</span>
                        <span className="text-gray-300 ml-2">initializing event analysis...</span>
                      </div>
                      <div className="text-gray-500 mt-2">Analyzing attendee data...</div>
                      <div className="text-gray-500">Processing engagement metrics...</div>
                      <div className="text-gray-500">Generating recommendations...</div>
                      <div className="flex items-center mt-2">
                        <span className="text-cyan-400">$</span>
                        <span className="text-gray-300 ml-2">analysis complete</span>
                      </div>
                      <div className="text-green-400 mt-2">✓ Optimization suggestions ready</div>
                    </div>
                  </div>
                  
                  {/* Animated UI Dashboard */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/60 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium">Attendee Engagement</h4>
                        <div className="w-8 h-8 rounded-lg bg-cyan-900/30 flex items-center justify-center">
                          <Users size={16} className="text-cyan-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-full w-5/6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/60 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium">Event Analytics</h4>
                        <div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center">
                          <BarChart3 size={16} className="text-blue-400" />
                        </div>
                      </div>
                      <div className="flex justify-between items-end h-20">
                        {[40, 70, 30, 80, 60].map((height, i) => (
                          <div key={i} className="w-3 bg-gray-800 rounded-sm" style={{ height: `${height}%` }}>
                            <div className="h-full w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-sm"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="col-span-2 bg-black/60 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium">AI Recommendations</h4>
                        <div className="w-8 h-8 rounded-lg bg-cyan-900/30 flex items-center justify-center">
                          <Brain size={16} className="text-cyan-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gray-900/70 rounded-lg p-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-400">Optimize schedule for maximum engagement</span>
                        </div>
                        <div className="bg-gray-900/70 rounded-lg p-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-400">Personalize networking opportunities</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -right-4 -bottom-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full p-1 shadow-lg shadow-cyan-500/20">
                <div className="bg-black rounded-full p-3 border border-white/10">
                  <Brain size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-transparent to-transparent opacity-70"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-3xl p-1 overflow-hidden">
            <div className="relative rounded-3xl p-12 border border-white/5 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Transform</span> Your Events?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Join thousands of event planners who have revolutionized their approach with our AI-powered platform.
                </p>
                <div className="flex flex-wrap gap-6 justify-center">
                  <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-medium text-black shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                  <button className="group rounded-full bg-gray-900 border border-white/10 px-8 py-4 font-medium text-white hover:bg-gray-800 transition-all duration-300" onClick={() => navigate("/contact")}>
                    <span className="flex items-center gap-2">
                      Schedule Demo <Calendar size={18} />
                    </span>
                  </button>
                </div>
                
                <div className="mt-16 pt-8 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Style for animated background */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(20px, 20px) rotate(10deg); }
        }
        
        .perspective {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .-rotate-y-12 {
          transform: rotateY(-12deg);
        }
        
        .-rotate-x-12 {
          transform: rotateX(-12deg);
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Our AI analyzes attendee preferences and speaker availability to create optimal event schedules that maximize engagement.",
  },
  {
    icon: Users,
    title: "Attendee Matching",
    description:
      "Connect the right people at your events with our intelligent networking algorithm that suggests valuable connections.",
  },
  {
    icon: Zap,
    title: "Real-time Adaptation",
    description:
      "Our system monitors event engagement in real-time and suggests adjustments to improve attendee experience on the fly.",
  },
  {
    icon: Brain,
    title: "Automated Follow-ups",
    description: "Maintain momentum after your event with AI-generated, personalized follow-up communications.",
  },
];

const techFeatures = [
  {
    icon: Cpu,
    title: "Computer Vision",
    description: "Analyze crowd density, engagement levels, and traffic flow using advanced image recognition.",
  },
  {
    icon: Code,
    title: "API Integrations",
    description:
      "Seamlessly integrate with your favorite tools and platforms for a unified event management experience.",
  },
  {
    icon: BarChart3,
    title: "Data Visualization",
    description:
      "Transform complex data into easy-to-understand visualizations that help you make informed decisions.",
  },
];

const aboutCards = [
  {
    title: "Our Mission",
    description:
      "To empower event planners with AI-driven insights and tools that make every event a success.",
    year: "2023",
    icon: Calendar,
  },
  {
    title: "Our Vision",
    description:
      "To create a world where every event is personalized, engaging, and unforgettable.",
    year: "2023",
    icon: Users,
  },
  {
    title: "Our Values",
    description:
      "Innovation, collaboration, and excellence are at the core of everything we do.",
    year: "2023",
    icon: Zap,
  },
];

const stats = [
  { value: "5000+", label: "Events Hosted" },
  { value: "1M+", label: "Attendees Engaged" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const testimonials = [
  {
    name: "John Doe",
    position: "Event Planner",
    feedback:
      "EventAI has transformed the way we plan and execute our events. The insights are invaluable!",
  },
  {
    name: "Jane Smith",
    position: "Marketing Director",
    feedback:
      "The AI recommendations helped us increase engagement by 30%! Highly recommend.",
  },
  {
    name: "Mike Johnson",
    position: "Conference Organizer",
    feedback:
      "A game-changer in the event industry. The platform is user-friendly and incredibly powerful.",
  },
];

const faqs = [
  {
    question: "How does your AI technology work?",
    answer:
      "Our AI analyzes vast amounts of data from past events to provide insights and recommendations tailored to your specific needs.",
  },
  {
    question: "Is the platform easy to use?",
    answer:
      "Absolutely! We designed our platform with user experience in mind, ensuring that even those without technical expertise can navigate it easily.",
  },
  {
    question: "Can I integrate EventAI with my existing tools?",
    answer:
      "Yes, we offer API integrations with popular event management tools, CRM systems, and more.",
  },
];


