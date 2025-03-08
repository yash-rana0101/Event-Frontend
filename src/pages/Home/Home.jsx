import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function EventManagementLanding() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const navigate = useNavigate();
  // const pricingRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  // const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b text-white">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-cyan-500 rounded-full blur-[120px]" />
      </motion.div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative z-10 px-6 pt-20 pb-32 lg:px-12 lg:pt-32 lg:pb-40 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Organize Events <br className="hidden md:block" />
          With Confidence
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The all-in-one platform that makes event planning seamless,
          from registration to post-event analytics.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="px-8 py-3 rounded-lg font-bold text-black bg-cyan-500 hover:opacity-90 transition-all hover:border hover:border-cyan-500 hover:bg-black hover:text-cyan-500 hover:cursor-pointer duration-300">
            Create Your Event
          </button>
          <button className="px-8 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/10 transition-colors hover:cursor-pointer duration-300"
           onClick={() => navigate("/event")}>  
            Explore Events
          </button>
        </motion.div>
        <motion.div
          className="relative w-full max-w-4xl h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <img
            src="https://i.ibb.co/Dfm1NMpb/Screenshot-2025-02-21-164657.png"
            alt="Event Management Dashboard"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16 lg:px-12 bg-slate-800/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Events Hosted" },
              { number: "1M+", label: "Attendees" },
              { number: "150+", label: "Countries" },
              { number: "99%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {stat.number}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="relative z-10 px-6 py-24 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Every Event</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Everything you need to create, manage, and grow your events, all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Event Creation",
                description: "Create beautiful event pages with customizable templates and branding options.",
                icon: "🎨"
              },
              {
                title: "Registration & Ticketing",
                description: "Seamless registration process with multiple ticket types and pricing options.",
                icon: "🎟️"
              },
              {
                title: "Attendee Management",
                description: "Manage your guest list, send communications, and track attendance.",
                icon: "👥"
              },
              {
                title: "Marketing Tools",
                description: "Promote your event with email campaigns, social sharing, and SEO optimization.",
                icon: "📢"
              },
              {
                title: "Analytics & Insights",
                description: "Get real-time data on registrations, attendance, and engagement.",
                icon: "📊"
              },
              {
                title: "Mobile Experience",
                description: "Provide attendees with a seamless mobile experience for check-in and engagement.",
                icon: "📱"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="relative z-10 px-6 py-24 lg:px-12 bg-slate-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How EventFlow Works</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              A simple process to create and manage successful events.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>

            {[
              {
                step: "01",
                title: "Create Your Event",
                description: "Set up your event details, customize your page, and set ticket options."
              },
              {
                step: "02",
                title: "Promote & Sell",
                description: "Share your event, sell tickets, and manage registrations all in one place."
              },
              {
                step: "03",
                title: "Host & Analyze",
                description: "Run your event smoothly and get insights to improve future events."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className="relative z-10 px-6 py-24 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Event Organizers Say</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Join thousands of event planners who've transformed their events with EventFlow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "EventFlow transformed how we manage our annual conference. The platform is intuitive and the analytics are game-changing.",
                name: "Sarah Johnson",
                role: "Conference Director",
                company: "TechSummit"
              },
              {
                quote: "The registration process is seamless, and our attendees love the mobile experience. It's made our events much more professional.",
                name: "Michael Chen",
                role: "Event Manager",
                company: "Global Meetups"
              },
              {
                quote: "We've increased ticket sales by 40% since switching to EventFlow. The marketing tools are powerful yet easy to use.",
                name: "Jessica Williams",
                role: "Marketing Director",
                company: "Creative Workshops"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-4 text-2xl">❝</div>
                <p className="text-slate-300 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 mr-3"></div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section
        id="pricing"
        ref={pricingRef}
        className="relative z-10 px-6 py-24 lg:px-12 bg-slate-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Choose the plan that fits your event needs. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$49",
                period: "per month",
                description: "Perfect for small events and workshops",
                features: [
                  "Up to 100 attendees",
                  "Basic event page",
                  "Email notifications",
                  "Ticket management",
                  "Basic analytics"
                ],
                cta: "Get Started",
                highlighted: false
              },
              {
                name: "Professional",
                price: "$99",
                period: "per month",
                description: "Ideal for growing events and conferences",
                features: [
                  "Up to 500 attendees",
                  "Custom event pages",
                  "Marketing tools",
                  "Multiple ticket types",
                  "Advanced analytics",
                  "Priority support"
                ],
                cta: "Get Started",
                highlighted: true
              },
              {
                name: "Enterprise",
                price: "$249",
                period: "per month",
                description: "For large-scale events and organizations",
                features: [
                  "Unlimited attendees",
                  "White-label solution",
                  "API access",
                  "Dedicated account manager",
                  "Custom integrations",
                  "On-site support options"
                ],
                cta: "Contact Sales",
                highlighted: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-6 border ${plan.highlighted
                  ? "bg-gradient-to-b from-purple-900/50 to-blue-900/50 border-purple-500/50"
                  : "bg-white/5 border-white/10"
                  }`}
                initial={{ opacity: 0, y: 20 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
                <p className="text-slate-300 mb-6">{plan.description}</p>
                <ul className="mb-8 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium ${plan.highlighted
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity"
                  : "border border-white/20 hover:bg-white/10 transition-colors"
                  }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <hr className="border-t border-white/50" />

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="relative z-10 px-6 py-24 lg:px-12"
      >
        <motion.div
          className="max-w-4xl mx-auto text-center bg-gradient-to-r rounded-2xl p-12 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-xl"
          style={{
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Glossy highlight effect */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"></div>

          {/* Light reflection */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Events?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Join thousands of event organizers who are creating unforgettable experiences with EventFlow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity shadow-lg">
                Start Free Trial
              </button>
              <button className="px-8 py-3 rounded-lg font-medium border border-white/30 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-lg">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer would go here */}
    </div>
  );
}