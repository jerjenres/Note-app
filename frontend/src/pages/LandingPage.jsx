import React from 'react';
import { Link } from 'react-router-dom';
import {
  NotebookPen,
  Cloud,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" />
                Trusted by 100,000+ users
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Capture Your
                <span className="text-blue-600 block">Brilliant Ideas</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                The most intuitive note-taking app designed for modern professionals.
                Organize, collaborate, and never lose a thought again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="btn-primary inline-flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="btn-secondary inline-flex items-center justify-center">
                  Sign In
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free forever
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Setup in 30 seconds
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center mb-4">
                    <NotebookPen className="h-8 w-8 mr-3" />
                    <h3 className="text-lg font-semibold">Meeting Notes</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm">• Discuss Q1 roadmap and priorities</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm">• Review budget allocation</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm">• Plan team building activities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-float">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 rounded-full p-3 shadow-lg animate-float" style={{animationDelay: '1s'}}>
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you capture, organize, and share your ideas effortlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your notes are encrypted and secure. Only you can access your private thoughts.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-2xl mb-4">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Quick search, instant sync, and responsive interface for maximum productivity.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Share notes and collaborate with your team members seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;