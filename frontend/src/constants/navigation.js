export const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'testimonials', label: 'Testimonials' },
  {
    id: 'services-dropdown',
    label: 'Services',
    children: [
      { id: 'services', label: 'Services' },
      { id: 'menu', label: 'Menu' },
    ],
  },
  {
    id: 'news-blogs-dropdown',
    label: 'News & Blogs',
    children: [
      { id: 'company-events-announcements', label: 'Events & Announcements' },
      { id: 'news-blogs', label: 'News & Blogs', isExternal: true },
    ],
  },
  { id: 'faq', label: 'FAQS' },
  { id: 'contact', label: 'Contact' },
];