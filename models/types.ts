
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  category: 'All' | 'Mobile' | 'Web' | 'Desktop';
}

export interface Skill {
  name: string;
  icon: string;
  level: number; // 0 to 100
  category: 'Frontend' | 'Backend' | 'Tools' | 'Others';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  avatar: string;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}
