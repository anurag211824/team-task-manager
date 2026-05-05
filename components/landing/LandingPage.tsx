'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  CheckCircle,
  Users,
  BarChart3,
  MessageSquare,
  Shield,
  Zap,
  ArrowRight,
  Rocket,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance, built on modern technology stack.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates and team communication.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track progress with powerful dashboards and detailed insights.',
    },
    {
      icon: MessageSquare,
      title: 'Built-in Chat',
      description: 'Communicate within tasks and projects without context switching.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with role-based access control and encryption.',
    },
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Organize, prioritize, and track tasks with intuitive workflows.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Projects Created' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Rocket className="h-4 w-4" />
              Welcome to TaskFlow
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Manage Your Projects with
            <span className="block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Confidence & Clarity
            </span>
          </h1>

          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            TaskFlow is the all-in-one platform for team project management. Collaborate,
            communicate, and complete projects faster than ever before.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-lg hover:from-blue-600 hover:to-blue-700 sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full border-gray-300 px-8 py-6 text-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Rocket className="mx-auto mb-4 h-16 w-16 text-blue-500 opacity-50" />
                <p className="text-gray-500 dark:text-gray-400">
                  Dashboard Preview Coming Soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Powerful Features Built for Teams
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to manage projects and collaborate effectively
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that works best for your team
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Starter */}
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Starter
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $0
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                  Perfect for getting started
                </p>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Up to 3 projects
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      5 team members
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Basic support
                    </span>
                  </li>
                </ul>
                <Link href="/signup" className="w-full block">
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Professional */}
            <Card className="border-2 border-blue-500 bg-white dark:border-blue-500 dark:bg-gray-950 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Professional
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $29
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                  For growing teams
                </p>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Unlimited projects
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      50 team members
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Priority support
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Advanced analytics
                    </span>
                  </li>
                </ul>
                <Link href="/signup" className="w-full block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Enterprise */}
            <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Enterprise
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    Custom
                  </span>
                </div>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                  For large organizations
                </p>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Everything in Professional
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Unlimited team members
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Custom integrations
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Dedicated support
                    </span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of teams that trust TaskFlow to manage their projects.
            Start free today, no credit card required.
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-lg hover:from-blue-600 hover:to-blue-700">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
