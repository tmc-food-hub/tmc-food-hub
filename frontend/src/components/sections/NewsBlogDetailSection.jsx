'use client';

import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import tmcLogo from '../../assets/imgs/tmc-foodhub-logo.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Download,
  Bookmark,
  Check,
  Printer,
  Mail
} from 'lucide-react';
import { ThemeContext } from '../ui/ThemeContext';
import BlogCard from '../ui/BlogCard';
import "../../assets/css/news-blog-detail.css";

// ===== Blogs Array (Shared from NewsBlogSection) =====
const allBlogs = [
  { id: 1, tag: "System Architecture", title: "Optimizing Scalability in Modern IT Ecosystems", date: "Feb 3, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 2, tag: "Data Analytics", title: "Predictive Analytics: Anticipating Talent Gaps", date: "Feb 3, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 3, tag: "Platform Updates", title: "Introducing TMC Foodhub Flow: Seamless Hiring Pipelines", date: "Feb 3, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 4, tag: "IT Workforce Strategy", title: "Bridging the Skills Gap in Full-Stack Development", date: "Feb 3, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 5, tag: "Case Studies", title: "How GlobalTech Reduced Hiring Costs by 40%", date: "Feb 3, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 6, tag: "IT Workforce Strategy", title: "AI & The Future of Technical Resourcing", date: "Feb 3, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 7, tag: "Newsletter", title: "TMC Foodhub Monthly: February 2026 Edition", date: "Feb 1, 2026", readTime: "5 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 8, tag: "Research", title: "2026 IT Talent Landscape Report", date: "Jan 28, 2026", readTime: "12 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 9, tag: "Product Update", title: "TMC Foodhub Introduces Advanced Filtering for Faster Talent Matching", date: "January 10, 2026", readTime: "3 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 10, tag: "Company News", title: "TMC Foodhub Reaches Early Adoption Milestone Among Digital Agencies", date: "January 22, 2026", readTime: "2 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 11, tag: "Platform Overview", title: "What Is TMC Foodhub? A Smarter Way to Manage Talent", date: "February 2, 2026", readTime: "5 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 12, tag: "Industry Trends", title: "The Shift Toward Centralized Talent Platforms", date: "February 15, 2026", readTime: "6 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 13, tag: "System Architecture", title: "Behind the Code: Ensuring Security in Cloud-Native Hiring Platforms", date: "November 20, 2025", readTime: "10 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 14, tag: "IT Workforce Strategy", title: "From Fragmented to Focused: The Future of Employer-Side Resource Management", date: "February 10, 2026", readTime: "8 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 15, tag: "Platform Updates", title: "TMC Foodhub 2.0 Release Notes: Enhanced Criteria-Based Filtering Engine", date: "January 3, 2026", readTime: "5 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 16, tag: "Case Studies", title: "Case Study: Scaling Frontend Teams for a High-Traffic E-Commerce Giant", date: "January 15, 2026", readTime: "12 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 17, tag: "Newsletter", title: "The Autopilot Monthly: Trends in Automation and CRM Development", date: "December 05, 2025", readTime: "6 min read", image: "/assets/images/newsblog/news_blog.png" },
  { id: 18, tag: "System Architecture", title: "Microservices vs Monoliths: Making the Right Choice for Your Organization", date: "December 15, 2025", readTime: "9 min read", image: "/assets/images/newsblog/news_blog.png" }
];

// ===== Content Generator Functions =====
const generateSummary = (title, tag) => {
  const summaries = {
    "System Architecture": "Discover how modern system architecture principles enable scalable, resilient IT ecosystems that adapt to changing business demands while maintaining optimal performance.",
    "Data Analytics": "Learn how predictive analytics and data-driven insights are transforming workforce planning and helping organizations anticipate talent gaps before they impact operations.",
    "Platform Updates": "Explore the latest TMC Foodhub platform enhancements designed to streamline hiring workflows and deliver more intelligent talent matching capabilities.",
    "IT Workforce Strategy": "Strategic approaches to building, managing, and optimizing IT teams in an era of rapid technological change and evolving skill requirements.",
    "Case Studies": "Real-world success stories demonstrating how organizations have transformed their talent acquisition and resource management processes.",
    "Newsletter": "Curated insights and updates from the TMC Foodhub team, delivered to keep you informed about the latest in workforce optimization.",
    "Research": "In-depth analysis and research findings on emerging trends in IT workforce management and talent technology.",
    "Product Update": "Detailed overview of new features and improvements in the TMC Foodhub platform, designed to enhance user experience and efficiency.",
    "Company News": "Recent milestones, achievements, and developments from the TMC Foodhub team as we continue to grow and innovate.",
    "Platform Overview": "A comprehensive introduction to TMC Foodhub's core capabilities and how our platform solves critical talent management challenges.",
    "Industry Trends": "Analysis of emerging patterns and shifts in the talent technology landscape and what they mean for your organization."
  };

  return summaries[tag] || `Explore our latest insights on ${title.toLowerCase()} and learn how TMC Foodhub is transforming talent management.`;
};

const generateContent = (title, tag) => {
  const contentTemplates = {
    "System Architecture": `
      <h2>The Evolution of IT Infrastructure</h2>
      <p>Modern enterprises face unprecedented challenges in scaling their technical infrastructure. Traditional monolithic architectures are giving way to distributed systems that offer greater flexibility and resilience.</p>
      
      <h2>Key Architectural Considerations</h2>
      <p>When designing scalable systems, organizations must consider several critical factors:</p>
      <ul>
        <li><strong>Horizontal vs Vertical Scaling:</strong> Understanding when to scale out versus scaling up</li>
        <li><strong>Microservices Design Patterns:</strong> Breaking down applications into manageable, independent services</li>
        <li><strong>Data Management Strategies:</strong> Implementing effective database sharding and caching mechanisms</li>
        <li><strong>Observability:</strong> Building monitoring and logging capabilities from the ground up</li>
      </ul>
      
      <h2>The Role of Cloud-Native Technologies</h2>
      <p>Cloud-native approaches, including containerization and orchestration platforms, have revolutionized how we deploy and manage applications at scale.</p>
    `,
    "Data Analytics": `
      <h2>From Descriptive to Predictive</h2>
      <p>The evolution of data analytics has moved from understanding what happened to predicting what will happen next. This shift enables proactive decision-making in workforce planning.</p>
      
      <h2>Implementing Predictive Models</h2>
      <p>Successful predictive analytics initiatives typically follow these steps:</p>
      <ul>
        <li><strong>Data Collection:</strong> Gathering historical workforce and performance data</li>
        <li><strong>Feature Engineering:</strong> Identifying relevant variables that influence outcomes</li>
        <li><strong>Model Selection:</strong> Choosing appropriate algorithms for specific use cases</li>
        <li><strong>Validation:</strong> Testing model accuracy before deployment</li>
      </ul>
      
      <h2>Real-World Applications</h2>
      <p>Organizations using predictive analytics have reported significant improvements in retention forecasting and skills gap identification.</p>
    `,
    "IT Workforce Strategy": `
      <h2>Redefining Talent Management</h2>
      <p>The traditional approach to workforce planning is no longer sufficient in today's fast-paced technology landscape. Organizations must adopt more agile, skills-based strategies.</p>
      
      <h2>Strategic Framework Components</h2>
      <ul>
        <li><strong>Skills Inventory:</strong> Maintaining real-time visibility into organizational capabilities</li>
        <li><strong>Gap Analysis:</strong> Identifying current and future skill requirements</li>
        <li><strong>Development Pathways:</strong> Creating clear progression routes for technical talent</li>
        <li><strong>Flexible Resourcing:</strong> Enabling dynamic allocation of resources across projects</li>
      </ul>
      
      <h2>Measuring Success</h2>
      <p>Key metrics for workforce strategy include utilization rates, time-to-competency, and internal mobility percentages.</p>
    `,
    "Case Studies": `
      <h2>The Challenge</h2>
      <p>Like many organizations in their sector, our client faced significant challenges in scaling their technical teams while maintaining quality standards and controlling costs.</p>
      
      <h2>The Solution</h2>
      <p>By implementing TMC Foodhub's talent management platform, they gained unprecedented visibility into their workforce capabilities and streamlined their hiring processes.</p>
      
      <h2>The Results</h2>
      <ul>
        <li><strong>40% reduction</strong> in cost-per-hire</li>
        <li><strong>60% faster</strong> time-to-fill for critical roles</li>
        <li><strong>25% improvement</strong> in candidate quality scores</li>
      </ul>
    `,
    "Platform Updates": `
      <h2>What's New in TMC Foodhub 2.0</h2>
      <p>We're excited to announce significant updates to the TMC Foodhub platform that enhance performance, usability, and matching accuracy.</p>
      
      <h2>Enhanced Filtering Engine</h2>
      <p>Our new criteria-based filtering engine allows for more precise talent matching, reducing search time by over 50%.</p>
      
      <h2>Improved User Experience</h2>
      <p>Based on customer feedback, we've redesigned key workflows to be more intuitive and efficient.</p>
    `
  };

  return contentTemplates[tag] || `
    <h2>Understanding ${title}</h2>
    <p>This comprehensive guide explores the key concepts, best practices, and strategic considerations for organizations looking to optimize their approach to ${tag.toLowerCase()}.</p>
    
    <h2>Key Insights</h2>
    <p>Based on our research and client engagements, we've identified several critical success factors that distinguish high-performing organizations in this area.</p>
    
    <h2>Looking Ahead</h2>
    <p>As technology continues to evolve, organizations must remain adaptable and forward-thinking in their approach to talent management and technical operations.</p>
  `;
};

const generateKeyTakeaways = (tag) => {
  const takeawayMap = {
    "System Architecture": [
      'Scalable architecture requires both technical and organizational alignment',
      'Cloud-native technologies enable more flexible infrastructure management',
      'Observability is essential for maintaining system reliability'
    ],
    "Data Analytics": [
      'Predictive models can forecast talent needs 6-12 months in advance',
      'Data quality is the single most important factor in analytics success',
      'Organizations should start with specific, high-impact use cases'
    ],
    "IT Workforce Strategy": [
      'Skills-based planning outperforms traditional headcount-based approaches',
      'Internal mobility reduces costs and improves retention',
      'Regular skills assessments enable proactive gap remediation'
    ],
    "Case Studies": [
      'Real-world implementations consistently show ROI within 6 months',
      'Success requires both technology adoption and process change',
      'Executive sponsorship is critical for transformation initiatives'
    ],
    "Platform Updates": [
      'New filtering capabilities reduce search time by 50%',
      'Enhanced matching algorithms improve candidate quality scores',
      'Streamlined workflows accelerate time-to-hire'
    ]
  };

  return takeawayMap[tag] || [
    'Data-driven decision making reduces hiring risk',
    'Internal resource mobility optimizes workforce efficiency',
    'Agile resourcing enables faster response to changing business needs',
    'Continuous learning and development improves retention',
    'Technology platforms enable scalable talent management processes'
  ];
};

const generateAuthor = (tag) => {
  const authors = {
    "System Architecture": "TMC Foodhub Engineering Team",
    "Data Analytics": "TMC Foodhub Analytics Team",
    "Platform Updates": "TMC Foodhub Product Team",
    "IT Workforce Strategy": "TMC Foodhub Strategy Team",
    "Case Studies": "TMC Foodhub Customer Success Team",
    "Newsletter": "TMC Foodhub Editorial Team",
    "Research": "TMC Foodhub Research Department",
    "Product Update": "TMC Foodhub Product Team",
    "Company News": "TMC Foodhub Communications Team",
    "Platform Overview": "TMC Foodhub Solutions Team",
    "Industry Trends": "TMC Foodhub Market Intelligence Team"
  };

  return authors[tag] || "TMC Foodhub Editorial Team";
};

const generateTags = (tag) => {
  const tagMap = {
    "System Architecture": ["Cloud Computing", "Scalability", "Infrastructure", "DevOps"],
    "Data Analytics": ["Predictive Analytics", "Workforce Planning", "Data Science", "HR Tech"],
    "IT Workforce Strategy": ["Talent Management", "Workforce Planning", "HR Strategy", "Future of Work"],
    "Case Studies": ["Success Stories", "ROI", "Implementation", "Results"],
    "Platform Updates": ["New Features", "Product Launch", "Innovation", "TMC Foodhub Platform"],
    "Product Update": ["New Features", "Product Launch", "Innovation", "TMC Foodhub Platform"],
    "Company News": ["TMC Foodhub", "Growth", "Milestones", "Team"],
    "Platform Overview": ["TMC Foodhub Platform", "Talent Management", "Features", "Overview"],
    "Industry Trends": ["Market Trends", "Future of Work", "HR Tech", "Innovation"],
    "Newsletter": ["Monthly Update", "News", "Insights", "TMC Foodhub"],
    "Research": ["Research", "Data", "Analysis", "Trends"]
  };

  return tagMap[tag] || [tag, "Talent Management", "Workforce Optimization", "TMC Foodhub"];
};

// ===== Function to generate tag description =====
const generateTagDescription = (tag) => {
  const descriptions = {
    "System Architecture": "System architecture determines how effectively organizations scale and innovate in today's digital economy. Our engineering team shares battle-tested patterns for building resilient, cloud-native infrastructures that adapt to changing business demands.",
    "Data Analytics": "Predictive analytics transforms workforce data from historical records into forward-looking intelligence. Learn how organizations are using data science to forecast talent needs, identify skill gaps, and optimize resource allocation with measurable precision.",
    "Platform Updates": "TMC Foodhub continuously evolves to address the real-world challenges of technical hiring. Each release brings enhanced matching capabilities, streamlined workflows, and performance improvements driven directly by customer feedback.",
    "IT Workforce Strategy": "Skills-based workforce planning outperforms traditional headcount models in today's fast-changing technology landscape. Discover how leading organizations build agile talent ecosystems through internal mobility, continuous development, and dynamic resource allocation.",
    "Case Studies": "Real organizations achieve measurable results with TMC Foodhub's talent management platform. These case studies document specific challenges, implemented solutions, and the concrete ROI realized by companies across industries.",
    "Newsletter": "Stay informed with curated insights from TMC Foodhub's workforce optimization experts. Each monthly edition delivers actionable intelligence on talent trends, platform updates, and strategic best practices.",
    "Research": "TMC Foodhub's research team analyzes millions of data points to uncover patterns in IT workforce dynamics. Our reports provide evidence-based guidance for leaders navigating skill shortages, emerging technologies, and shifting talent expectations.",
    "Product Update": "Every product release represents months of development and user testing. We detail new features, design decisions, and implementation best practices to help you maximize value from every enhancement.",
    "Company News": "TMC Foodhub's journey is driven by our mission to transform technical talent management. Stay updated on our milestones, team growth, partnerships, and the customer stories that inspire our work.",
    "Platform Overview": "TMC Foodhub unifies talent acquisition and resource management into a single, intelligent platform. Learn how our matching engine, analytics tools, and collaborative workflows solve the unique challenges of technical hiring.",
    "Industry Trends": "The talent technology landscape is evolving faster than ever before. Our market intelligence team analyzes emerging patterns in skills development, hiring practices, and workforce strategy to help you stay ahead."
  };

  return descriptions[tag] || `Expert insights and practical guidance on ${tag} from the TMC Foodhub team. Discover strategies and best practices for optimizing your workforce management approach.`;
};

// ===== Function to generate article slug with correct URL format =====
const generateArticleSlug = (title, tag) => {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const newsTags = ["Platform Updates", "System Architecture", "Data Analytics", "Newsletter"];
  const blogTags = ["IT Workforce Strategy", "Research", "Case Studies"];

  if (newsTags.includes(tag)) {
    return `/news/${slug}`;
  } else if (blogTags.includes(tag)) {
    return `/blogs/${slug}`;
  } else {
    return `/blogs/${slug}`;
  }
};

// ===== Email Validation and Whitelist Function =====
const validateEmail = (email) => {
  // Whitelist: Only allow A-Z, a-z, 0-9, and @ symbols
  const allowedCharsRegex = /^[A-Za-z0-9@.+\-_\s]+$/;

  // Standard email format validation
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required' };
  }

  if (!allowedCharsRegex.test(email)) {
    return { isValid: false, error: 'Email can only contain letters, numbers, and @ symbol' };
  }

  if (!emailFormatRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
};

const sanitizeEmailInput = (input) => {
  // Whitelist filter - remove any character not in allowed set
  return input.replace(/[^A-Za-z0-9@.+\-_\s]/g, '');
};

const NewsBlogDetailSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [post, setPost] = useState(null);
  const { isDarkMode } = useContext(ThemeContext) || { isDarkMode: false };
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const moreMenuRef = useRef(null);
  const moreButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target) &&
        moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
      if (showShareMenu) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  const handleViewAllClick = () => {
    window.scrollTo(0, 0);
    navigate('/news-and-blogs');
  };

  const handleViewAllBlogs = (e) => {
    if (e) e.preventDefault();
    window.scrollTo(0, 0);
    navigate('/news-and-blogs');
  };

  useEffect(() => {
    const state = location.state;

    setLoading(true);

    if (state) {
      // State exists - coming from BlogCard click
      const category = state.tag || state.category || 'IT Workforce Strategy';

      const blogData = allBlogs.find(blog => blog.id === state.id) || {};

      const generatedPost = {
        id: state.id,
        tag: category,
        category: category.toUpperCase(),
        title: state.title,
        image: blogData.image || '/assets/images/newsblog/news_blog.webp',
        author: generateAuthor(category),
        authorAvatar: '/assets/images/AVAA-S Logo.png',
        date: state.date,
        readTime: state.readTime,
        summary: generateSummary(state.title, category),
        content: generateContent(state.title, category),
        keyTakeaways: generateKeyTakeaways(category),
        tags: generateTags(category),
        tagDescription: generateTagDescription(category),
        slug: generateArticleSlug(state.title, category),
        url: generateArticleSlug(state.title, category),
        fullUrl: `https://autopilotvirtual.com${generateArticleSlug(state.title, category)}`,
        relatedIds: []
      };

      setPost(generatedPost);

      let related = allBlogs
        .filter(blog =>
          blog.id !== state.id &&
          blog.tag === category
        )
        .slice(0, 3);

      if (related.length === 0) {
        const sortedBlogs = [...allBlogs]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .filter(blog => blog.id !== state.id);

        related = sortedBlogs.slice(0, 3);
      }

      setRelatedBlogs(related);
      setLoading(false);

    } else if (slug) {
      // No state but slug exists - direct URL access or page refresh
      const findBlogBySlug = () => {
        for (const blog of allBlogs) {
          const blogSlug = blog.title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

          if (blogSlug === slug) {
            return blog;
          }
        }
        return null;
      };

      const foundBlog = findBlogBySlug();

      if (foundBlog) {
        // Set the post directly without navigation to avoid loops
        const category = foundBlog.tag;

        const generatedPost = {
          id: foundBlog.id,
          tag: category,
          category: category.toUpperCase(),
          title: foundBlog.title,
          image: foundBlog.image || '/assets/images/newsblog/news_blog.webp',
          author: generateAuthor(category),
          authorAvatar: '/assets/images/AVAA-S Logo.png',
          date: foundBlog.date,
          readTime: foundBlog.readTime,
          summary: generateSummary(foundBlog.title, category),
          content: generateContent(foundBlog.title, category),
          keyTakeaways: generateKeyTakeaways(category),
          tags: generateTags(category),
          tagDescription: generateTagDescription(category),
          slug: generateArticleSlug(foundBlog.title, category),
          url: generateArticleSlug(foundBlog.title, category),
          fullUrl: `https://autopilotvirtual.com${generateArticleSlug(foundBlog.title, category)}`,
          relatedIds: []
        };

        setPost(generatedPost);

        let related = allBlogs
          .filter(blog =>
            blog.id !== foundBlog.id &&
            blog.tag === category
          )
          .slice(0, 3);

        if (related.length === 0) {
          const sortedBlogs = [...allBlogs]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .filter(blog => blog.id !== foundBlog.id);

          related = sortedBlogs.slice(0, 3);
        }

        setRelatedBlogs(related);
      } else {
        // Blog not found, redirect to news and blogs page
        navigate('/news-and-blogs');
      }
    } else {
      // No state and no slug, check if this is the old route
      const path = location.pathname;
      if (path === '/news-blog-detail') {
        // Try to get data from session storage or show error
        setLoading(false);
        // You might want to show a "Post not found" message here
      } else {
        navigate('/news-and-blogs');
      }
    }

    setLoading(false);
  }, [location.state, navigate, slug, location.pathname]);

  const handleShareClick = () => {
    const shareUrl = post?.fullUrl || window.location.href;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedToClipboard(true);
        setTimeout(() => {
          setCopiedToClipboard(false);
        }, 2000);

        if (navigator.share) {
          navigator.share({
            title: post?.title || 'TMC Foodhub Blog Post',
            text: `Check out this article: ${post?.title}`,
            url: shareUrl,
          }).catch(console.error);
        }
      })
      .catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedToClipboard(true);
        setTimeout(() => {
          setCopiedToClipboard(false);
        }, 2000);
      });

    setShowShareMenu(false);
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('a');
    const content = `
      ${post?.title}
      
      Published: ${post?.date}
      Author: ${post?.author}
      Read Time: ${post?.readTime}
      URL: ${post?.fullUrl}
      
      ${post?.summary}
      
      ${post?.content.replace(/<[^>]*>/g, '')}
      
      Key Takeaways:
      ${post?.keyTakeaways?.map(item => `• ${item}`).join('\n')}
      
      Tags: ${post?.tags?.join(', ')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = `${post?.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);

    setShowMoreMenu(false);
    alert('Article downloaded successfully!');
  };

  const handlePrintArticle = () => {
    window.print();
    setShowMoreMenu(false);
  };

  const handleEmailArticle = () => {
    const subject = encodeURIComponent(`Check out: ${post?.title}`);
    const body = encodeURIComponent(`I thought you might be interested in this article:\n\n${post?.title}\n\n${post?.fullUrl}\n\n${post?.summary}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowMoreMenu(false);
  };

  const handleBookmarkArticle = () => {
    const bookmarks = JSON.parse(localStorage.getItem('tmc-bookmarks') || '[]');
    const newBookmark = {
      id: post?.id,
      title: post?.title,
      date: post?.date,
      url: post?.fullUrl,
      slug: post?.slug,
      added: new Date().toISOString()
    };

    const alreadyBookmarked = bookmarks.some(b => b.id === post?.id);

    if (!alreadyBookmarked) {
      bookmarks.push(newBookmark);
      localStorage.setItem('tmc-bookmarks', JSON.stringify(bookmarks));
      alert('Article bookmarked!');
    } else {
      alert('Article is already bookmarked.');
    }

    setShowMoreMenu(false);
  };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;

    // Sanitize input: remove any disallowed characters
    const sanitizedValue = sanitizeEmailInput(inputValue);

    // Update email state with sanitized value
    setEmail(sanitizedValue);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      const validation = validateEmail(email);
      if (!validation.isValid) {
        setEmailError(validation.error);
      }
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Trim email to remove whitespace
    const trimmedEmail = email.trim();
    setEmail(trimmedEmail);

    // Validate email
    const validation = validateEmail(trimmedEmail);

    if (!validation.isValid) {
      setEmailError(validation.error);
      return;
    }

    // Clear any previous errors
    setEmailError('');

    // Proceed with subscription
    if (trimmedEmail) {
      setIsSubscribed(true);
      setTimeout(() => {
        alert(`Thank you for subscribing with ${trimmedEmail}!`);
        setEmail('');
        setIsSubscribed(false);
      }, 300);
    }
  };

  if (loading) return <div className="loading-state">Loading article...</div>;
  if (!post) return <div className="loading-state">Post not found.</div>;

  return (
    <div className={`news-blog-detail ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="content-container">

        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <a
            href="/"
            className={isDarkMode ? 'dark-mode' : ''}
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            Home
          </a> /
          <a
            href="/news-and-blogs"
            className={isDarkMode ? 'dark-mode' : ''}
            onClick={handleViewAllBlogs}
          >
            News & Blogs
          </a> /
          <span className={`current ${isDarkMode ? 'dark-mode' : ''}`}>
            {post.tag}
          </span>
        </nav>

        {/* Article Taxonomy & Title */}
        <div className="article-header-top">
          <span className={`category-tag ${isDarkMode ? 'dark-mode' : ''}`}>{post.category}</span>
          <h1 className={`article-title ${isDarkMode ? 'dark-mode' : ''}`}>{post.title}</h1>
        </div>

        {/* Author Block Section */}
        <div className="author-block">
          <div className="author-info">
            <div className="author-avatar">
              <img src={tmcLogo} alt="TMC Foodhub Logo" style={{ width: '52px', height: '52px' }} />
            </div>
            <div className="author-details">
              <h3 className={`author-name ${isDarkMode ? 'dark-mode' : ''}`}>{post.author}</h3>
              <p className={`author-meta ${isDarkMode ? 'dark-mode' : ''}`}>
                Published on {post.date} • {post.readTime}
              </p>
            </div>
          </div>

          <div className="article-actions">
            {/* Share Button */}
            <div className="action-wrapper">
              <button
                className={`action-btn ${isDarkMode ? 'dark-mode' : ''} ${copiedToClipboard ? 'copied' : ''}`}
                aria-label={copiedToClipboard ? "Copied!" : "Share"}
                onClick={handleShareClick}
                title={copiedToClipboard ? "URL copied to clipboard!" : "Copy link to share"}
              >
                <img
                  src="/assets/images/logo/link.svg"
                  alt="Share"
                  style={{
                    width: '20px',
                    height: '20px',
                    color: 'gray'
                  }}
                />
                {copiedToClipboard && (
                  <span className="copied-indicator">✓</span>
                )}
              </button>
            </div>

            {/* More Button with Dropdown */}
            <div className="action-wrapper" ref={moreMenuRef}>
              <button
                ref={moreButtonRef}
                className={`action-btn ${isDarkMode ? 'dark-mode' : ''}`}
                aria-label="More options"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                title="More options"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-ellipsis-icon lucide-ellipsis"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMoreMenu && (
                <div className={`dropdown-menu ${isDarkMode ? 'dark-mode' : ''}`}>
                  <button className="dropdown-item" onClick={handleDownloadPDF}>
                    <Download size={14} /> Download Article
                  </button>
                  <button className="dropdown-item" onClick={handlePrintArticle}>
                    <Printer size={14} /> Print Article
                  </button>
                  <button className="dropdown-item" onClick={handleEmailArticle}>
                    <Mail size={14} /> Email Article
                  </button>
                  <button className="dropdown-item" onClick={handleBookmarkArticle}>
                    <Bookmark size={14} /> Save to Bookmarks
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Article Body Content */}
        <div className={`executive-summary ${isDarkMode ? 'dark-mode' : ''}`}>
          <p><strong>Summary:</strong> {post.summary}</p>
        </div>

        <div className="hero-image" style={{ backgroundImage: `url(${post.image})` }} />

        {/* Tag Description - Two sentences */}
        <div className={`tag-description ${isDarkMode ? 'dark-mode' : ''}`}>
          <p>{post.tagDescription}</p>
        </div>

        <div className={`key-takeaways ${isDarkMode ? 'dark-mode' : ''}`}>
          <h3>Key Takeaways</h3>
          <ul className="takeaways-list">
            {post.keyTakeaways.map((item, idx) => (
              <li key={idx}>
                <div className={`takeaway-bullet ${isDarkMode ? 'dark-mode' : ''}`}>
                  <Check size={12} className="checkmark" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <article
          className={`article-body ${isDarkMode ? 'dark-mode' : ''}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="article-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className={`tag ${isDarkMode ? 'dark-mode' : ''}`}>{tag}</span>
          ))}
        </div>

        {/* Related Posts using BlogCard */}
        {relatedBlogs.length > 0 && (
          <section className={`related-posts-section ${isDarkMode ? 'dark-mode' : ''}`}>
            <h2 className="related-section-title">
              {relatedBlogs.some(blog => blog.tag === post.tag)
                ? 'Related posts'
                : 'Latest posts'}
            </h2>
            <div className="row g-4 mt-2">
              {relatedBlogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  tag={blog.tag}
                  title={blog.title}
                  date={blog.date}
                  readTime={blog.readTime}
                  image={blog.image}
                  delay={index * 100}
                />
              ))}
            </div>
            <div className="view-all-wrapper">
              <button
                className={`view-all-btn ${isDarkMode ? 'dark-mode' : ''}`}
                onClick={handleViewAllClick}
              >
                View all articles
              </button>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="newsletter-outer-wrapper">
          <div className={`newsletter-card ${isDarkMode ? 'dark-mode' : ''}`}>
            <span className={`newsletter-tag ${isDarkMode ? 'dark-mode' : ''}`}>
              STAY AHEAD OF THE CURVE
            </span>
            <h2 className={`newsletter-headline ${isDarkMode ? 'dark-mode' : ''}`}>
              Expert Insights Delivered to Your Inbox Monthly
            </h2>
            <p className={`newsletter-subheadline ${isDarkMode ? 'dark-mode' : ''}`}>
              Get the latest insights on resource management and IT workforce trends delivered weekly to your inbox.
            </p>

            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="newsletter-input-group">
                <div className="email-input-wrapper">
                  <input
                    type="text"
                    inputMode="email"
                    placeholder="Enter your work email"
                    className={`email-input ${isDarkMode ? 'dark-mode' : ''} ${emailError ? 'error' : ''}`}
                    required
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    aria-label="Email address"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <span id="email-error" className="email-error-message">
                      {emailError}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className={`subscribe-btn ${isDarkMode ? 'dark-mode' : ''}`}
                  disabled={isSubscribed}
                >
                  {isSubscribed ? 'Subscribed!' : 'Subscribe Now'}
                </button>
              </div>
            </form>
            <p className={`newsletter-footer-text ${isDarkMode ? 'dark-mode' : ''}`}>
              No spam. Unsubscribe at any time. Privacy protected.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default NewsBlogDetailSection;