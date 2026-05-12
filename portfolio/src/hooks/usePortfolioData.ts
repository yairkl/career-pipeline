import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, doc } from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  status: "Published" | "Draft";
  updatedAt: any;
  icon?: string;
  relatedSkills?: string[];
  githubLink?: string;
  projectLink?: string;
  order?: number;
}

export interface Skill {
  name: string;
  level: number;
  order?: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: string; // Keeping for compatibility, but adding dates
  startDate?: string;
  endDate?: string;
  description?: string;
  gpa?: string;
  recognitions?: string[];
  relatedSkills?: string[];
  order?: number;
}

export interface Employment {
  role: string;
  company: string;
  startDate: string;
  endDate?: string; // Optional for "Present"
  description?: string;
  relatedSkills?: string[];
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  aboutTitle: string;
  aboutDescription: string;
  heroTitle: string;
  heroDescription: string;
  profilePicture?: string;
  theme?: string;
  skills: Skill[];
  education: Education[];
  employment: Employment[];
}

export function usePortfolioData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Projects
    const projectsQuery = query(collection(db, "projects"));
    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      projectsData.sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 9999;
        const orderB = b.order !== undefined ? b.order : 9999;
        if (orderA !== orderB) return orderA - orderB;
        // Fallback to updatedAt
        const dateA = a.updatedAt?.toMillis?.() || 0;
        const dateB = b.updatedAt?.toMillis?.() || 0;
        return dateB - dateA;
      });

      setProjects(projectsData);
    });

    // Fetch Profile
    const unsubscribeProfile = onSnapshot(doc(db, "profile", "main"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Profile;
        
        // Helper to parse date strings for sorting
        const parseDate = (dateStr?: string) => {
          if (!dateStr) return new Date(0);
          const normalized = dateStr.toLowerCase().trim();
          if (normalized === 'present') return new Date();
          
          // Handle ranges like "2016 - 2020" by taking the end year
          if (normalized.includes('-')) {
            const parts = normalized.split('-');
            const lastPart = parts[parts.length - 1].trim();
            if (lastPart === 'present') return new Date();
            const d = new Date(lastPart);
            if (!isNaN(d.getTime())) return d;
          }

          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? new Date(0) : d;
        };

        // Sort employment: most recent end date first, then most recent start date
        if (data.employment) {
          data.employment.sort((a, b) => {
            const dateB = parseDate(b.endDate || b.startDate);
            const dateA = parseDate(a.endDate || a.startDate);
            return dateB.getTime() - dateA.getTime();
          });
        }

        // Sort skills: by order
        if (data.skills) {
          data.skills.sort((a, b) => {
            const orderA = a.order !== undefined ? a.order : 9999;
            const orderB = b.order !== undefined ? b.order : 9999;
            return orderA - orderB;
          });
        }

        // Sort education: by order, then most recent first
        if (data.education) {
          data.education.sort((a, b) => {
            const orderA = a.order !== undefined ? a.order : 9999;
            const orderB = b.order !== undefined ? b.order : 9999;
            if (orderA !== orderB) return orderA - orderB;

            const dateB = parseDate(b.endDate || b.startDate || b.year);
            const dateA = parseDate(a.endDate || a.startDate || a.year);
            return dateB.getTime() - dateA.getTime();
          });
        }

        setProfile(data);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching profile:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeProfile();
    };
  }, []);

  return { projects, profile, loading };
}
