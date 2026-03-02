export const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  {
    id: 'services-dropdown',
    label: 'Services',
    children: [
      { id: 'services', label: 'Services' },
      { id: 'menu', label: 'Menu' }
    ]
  },
  {
    id: 'resources-dropdown',
    label: 'News',
    children: [
      { id: 'company-events-announcements', label: 'Events & Announcements' },
      { id: 'news-blogs', label: 'News & Blogs', isExternal: true },
    ],
  },
  { id: 'testimonials', label: 'Testimonials' },
  {
    id: 'support-dropdown',
    label: 'Support',
    children: [
      { id: 'support', label: 'Support' },
      { id: 'faq', label: 'FAQ' },
    ],
  },
];