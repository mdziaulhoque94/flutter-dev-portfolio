
import React from 'react';
import { Smartphone, Globe, Layers, Zap, Shield, Rocket } from 'lucide-react';
import { Project, Skill, Testimonial, Service } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'FinTech Wallet Pro',
    description: 'A comprehensive digital banking solution with real-time transaction tracking and crypto integration.',
    image: 'https://picsum.photos/seed/fintech/800/600',
    techStack: ['Flutter', 'Dart', 'Firebase', 'Stripe API'],
    category: 'Mobile',
    liveLink: '#',
  },
  {
    id: '2',
    title: 'EduTrack Enterprise',
    description: 'Corporate learning management system used by over 50,000 employees globally.',
    image: 'https://picsum.photos/seed/edu/800/600',
    techStack: ['Flutter', 'REST API', 'Provider', 'Sentry'],
    category: 'Mobile',
    liveLink: '#',
  },
  {
    id: '3',
    title: 'HealthFlow Sync',
    description: 'Patient monitoring application with Bluetooth Low Energy integration for wearable devices.',
    image: 'https://picsum.photos/seed/health/800/600',
    techStack: ['Flutter', 'BLE', 'SQLite', 'Bloc'],
    category: 'Mobile',
    githubLink: '#',
  },
  {
    id: '4',
    title: 'MarketMaster Admin',
    description: 'Inventory and sales management dashboard for multi-vendor e-commerce platforms.',
    image: 'https://picsum.photos/seed/admin/800/600',
    techStack: ['Flutter Web', 'Appwrite', 'Riverpod'],
    category: 'Web',
    liveLink: '#',
  }
];

export const SKILLS: Skill[] = [
  { name: 'Flutter', icon: 'flutter', level: 98, category: 'Frontend' },
  { name: 'Dart', icon: 'dart', level: 95, category: 'Frontend' },
  { name: 'Firebase', icon: 'firebase', level: 90, category: 'Backend' },
  { name: 'Node.js', icon: 'node', level: 85, category: 'Backend' },
  { name: 'PostgreSQL', icon: 'sql', level: 80, category: 'Backend' },
  { name: 'Git / CI/CD', icon: 'git', level: 92, category: 'Tools' },
  { name: 'REST / GraphQL', icon: 'api', level: 94, category: 'Tools' },
  { name: 'UI/UX Design', icon: 'design', level: 88, category: 'Others' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'CTO',
    company: 'TechVentures Inc.',
    comment: 'One of the best Flutter developers we have ever worked with. The attention to detail and ability to solve complex state management issues is unparalleled.',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    id: 't2',
    name: 'Michael Chen',
    role: 'Product Lead',
    company: 'GrowthHub',
    comment: 'Delivered our MVP 2 weeks ahead of schedule. The code quality is top-tier and the app runs smoothly on both iOS and Android.',
    avatar: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    id: 't3',
    name: 'Elena Rodriguez',
    role: 'Founder',
    company: 'Vitality Health',
    comment: 'The user experience of the app exceeded our expectations. Our users love the fluid animations and intuitive navigation.',
    avatar: 'https://picsum.photos/seed/elena/100/100',
  }
];

export const SERVICES: Service[] = [
  {
    title: 'Cross-Platform Mobile Apps',
    description: 'High-performance applications for iOS and Android using a single codebase with Flutter.',
    icon: <Smartphone className="w-8 h-8 text-blue-500" />,
  },
  {
    title: 'Web & Desktop Development',
    description: 'Extending your mobile experience to the big screen with Flutter for Web, macOS, and Windows.',
    icon: <Globe className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: 'Architecture Consulting',
    description: 'Helping teams set up scalable architectures like Clean Architecture, Bloc, or Riverpod.',
    icon: <Layers className="w-8 h-8 text-purple-500" />,
  },
  {
    title: 'Performance Optimization',
    description: 'Deep profiling and optimization to achieve consistent 60/120 FPS in your Flutter apps.',
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: 'Security Audits',
    description: 'Ensuring your app data is protected with best practices in encryption and secure storage.',
    icon: <Shield className="w-8 h-8 text-green-500" />,
  },
  {
    title: 'Fast-Track MVP',
    description: 'Rapid prototyping and MVP development to get your product to market faster.',
    icon: <Rocket className="w-8 h-8 text-red-500" />,
  }
];
