import { ArrowRight, AlertCircle, Activity, TrendingUp, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const features = [
    {
      icon: Eye,
      title: "Drowsiness Detection",
      description: "Real-time eye tracking and blink rate analysis to detect fatigue",
    },
    {
      icon: AlertCircle,
      title: "Distraction Monitoring",
      description: "AI-powered detection of phone use and looking away behaviors",
    },
    {
      icon: TrendingUp,
      title: "Instant Alerts",
      description: "Immediate notifications when dangerous behaviors are detected",
    },
    {
      icon: Activity,
      title: "Performance Analytics",
      description: "Comprehensive dashboards with detailed driving analytics",
    },
  ];

  const stats = [
    { value: "98%", label: "Detection Accuracy" },
    { value: "24/7", label: "Real-time Monitoring" },
    { value: "1000+", label: "Drivers Protected" },
  ];

  return (
    <div className="bg-[#f7f9ff] overflow-hidden text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-white shadow-sm">
              <span className="text-sm font-bold text-blue-600">DS</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">DriveSafe</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="hidden items-center gap-10 md:flex"
          >
            <a href="#" className="border-b-2 border-blue-600 pb-1 text-blue-600 transition">
              Home
            </a>
            <a href="#features" className="text-slate-700 transition hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-700 transition hover:text-blue-600">
              How It Works
            </a>
            <Link to="/dashboard" className="text-slate-700 transition hover:text-blue-600">
              Dashboard
            </Link>
            <a href="#about" className="text-slate-700 transition hover:text-blue-600">
              About Us
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition hover:shadow-[0_10px_28px_rgba(59,130,246,0.3)]">
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28">
        {/* Background gradients and shapes */}
        <div className="absolute right-0 top-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-blue-100/80 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-blue-50/90 to-transparent blur-3xl" />

        {/* Floating tech elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute right-20 top-24 -z-10 h-64 w-64 rounded-full border border-blue-200/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-40 -z-10 h-48 w-48 rounded-full border border-blue-100/30"
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left Side */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-blue-100">
                    AI-Powered Safety
                  </span>
                </motion.div>

                <h1 className="max-w-xl text-5xl font-bold leading-[1.02] tracking-tight text-slate-950 md:text-6xl">
                  Smart Driver Monitoring System
                </h1>

                <p className="max-w-lg text-xl leading-relaxed text-slate-600">
                  Real-time AI detection for drowsiness, distractions, and dangerous driving behaviors. Protect your drivers with cutting-edge technology.
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_34px_rgba(59,130,246,0.28)]"
                >
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <button className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-8 py-4 font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">▶</span>
                  Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid gap-4 rounded-2xl border border-slate-100 bg-white/75 p-4 pt-12 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:grid-cols-3"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="rounded-xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="text-2xl font-bold text-slate-900 md:text-3xl">{stat.value}</div>
                    <div className="mt-2 text-sm text-slate-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Premium Car Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative min-h-[500px] lg:min-h-[680px] flex items-center justify-center"
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-blue-100/60 via-transparent to-blue-50/40 blur-3xl" />

              <div className="absolute inset-8 rounded-full border border-blue-100/60" />
              <div className="absolute inset-16 rounded-full border border-blue-100/35" />
              <div className="absolute inset-24 rounded-full border border-blue-100/20" />

              <div className="absolute bottom-9 left-1/2 h-24 w-[82%] -translate-x-1/2 rounded-full bg-slate-900/22 blur-3xl" />
              <div className="absolute bottom-14 left-1/2 h-10 w-[64%] -translate-x-1/2 rounded-full bg-slate-700/12 blur-2xl" />
              <div className="absolute bottom-7 left-1/2 h-3 w-[50%] -translate-x-1/2 rounded-full bg-white/40 blur-md" />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute right-10 top-14 z-10 rounded-2xl bg-blue-500/85 px-4 py-3 text-white shadow-[0_18px_40px_rgba(59,130,246,0.24)] backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xs font-semibold">
                    ✓
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">AI Protection</p>
                    <p className="text-sm text-white/90">Active & Monitoring</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -bottom-18 left-1/2 h-40 w-[36rem] -translate-x-1/2 rounded-full bg-blue-200/18 blur-3xl"
              />

              <div className="relative z-10 flex h-full w-full items-end justify-center px-3 pb-0 pt-6 sm:px-4">
                <motion.img
                  src="/drivesafe-car.png"
                  alt="White electric sedan"
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="h-full w-full max-h-[600px] scale-[1.22] object-contain object-bottom drop-shadow-[0_52px_84px_rgba(15,23,42,0.32)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-gradient-to-b from-[#f7f9ff] via-white to-[#f7f9ff]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 mb-4">Key Features</p>
            <h2 className="text-4xl font-bold text-slate-950 mb-4">Everything you need for safer driving</h2>
            <p className="text-lg text-slate-600">
              Advanced AI-powered monitoring for comprehensive driver safety
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-300 hover:border-blue-200/50 hover:shadow-[0_18px_36px_rgba(59,130,246,0.10)]"
                >
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-300/30 group-hover:shadow-blue-400/40"
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="relative z-10 text-slate-600">{feature.description}</p>

                  {/* Hover glow effect */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 mb-4">How It Works</p>
            <h2 className="text-4xl font-bold text-slate-950 mb-4">Simple, Intelligent, Effective</h2>
            <p className="text-lg text-slate-600">
              Our AI system processes real-time video to detect and prevent dangerous driving behaviors
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
            {/* Connection line */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 hidden lg:block" style={{ zIndex: 0 }} />

            {[
              {
                step: 1,
                title: "Real-time Video Capture",
                description: "Our system continuously captures video from in-vehicle cameras"
              },
              {
                step: 2,
                title: "Face & Eye Detection",
                description: "Advanced AI models detect facial landmarks and eye movements"
              },
              {
                step: 3,
                title: "Behavior Analysis",
                description: "Algorithms analyze blink rates, gaze direction, and head position"
              },
              {
                step: 4,
                title: "Instant Alerts",
                description: "Automatic notifications triggered for risky behaviors detected"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative z-10 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xl shadow-lg shadow-blue-300/30">
                    {item.step}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 py-20">
        {/* Background shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-20 w-64 h-64 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-20 w-48 h-48 border border-white/5 rounded-full"
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-6 text-5xl font-bold text-white">Ready to Protect Your Drivers?</h2>
            <p className="mb-10 text-xl text-blue-100">
              Join thousands of organizations using DriveSafe to monitor and improve driver safety
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-2xl transition duration-300 flex items-center gap-2 group"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="px-6 py-20 bg-gradient-to-b from-[#f7f9ff] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 mb-4">About Us</p>
                <h2 className="text-4xl font-bold text-slate-950 mb-4">Driven by Safety, Powered by AI</h2>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                DriveSafe was founded with a simple mission: to save lives by preventing accidents before they happen. Our team of AI researchers, automotive engineers, and safety experts have combined their expertise to create the most advanced driver monitoring system available.
              </p>

              <p className="text-lg text-slate-600 leading-relaxed">
                We believe that every driver deserves protection from fatigue and distraction. Our technology uses cutting-edge computer vision and machine learning to detect dangerous behaviors in real-time, giving drivers and fleet managers the tools they need to stay safe on the road.
              </p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_34px_rgba(59,130,246,0.28)]"
                >
                  Join Our Mission
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid gap-6"
            >
              {[
                {
                  title: "Our Mission",
                  description: "To prevent accidents and save lives through intelligent driver monitoring technology",
                  icon: "🎯"
                },
                {
                  title: "Our Vision",
                  description: "A world where AI-powered safety systems eliminate preventable traffic accidents",
                  icon: "🔮"
                },
                {
                  title: "Our Values",
                  description: "Safety first, innovation always, and continuous improvement in everything we do",
                  icon: "⭐"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DS</span>
                </div>
                <span className="font-bold text-gray-900">DriveSafe</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered driver monitoring for safer roads
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2026 DriveSafe. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                LinkedIn
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
