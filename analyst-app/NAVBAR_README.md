# Navbar Component Documentation

This project includes a modern, responsive navbar component inspired by the UI Analyst navbar implementation.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Backdrop blur effects and smooth transitions
- **Smart Navigation**: Handles both page navigation and section scrolling
- **Mobile-First**: Optimized for mobile experience with hamburger menu
- **Accessibility**: Proper ARIA labels and focus management
- **Dark Theme**: Beautiful dark theme with gradient effects

## Component Structure

### Navbar Component (`src/components/Navbar.tsx`)

The navbar component includes:

- **Props**: `variant` prop for different styling variants ('default' | 'hero')
- **State Management**: Mobile menu state, scroll detection, and navigation handling
- **Responsive Layout**: Different layouts for mobile and desktop
- **Navigation Items**: About, Features, Pricing, Contact, and Blog links
- **CTA Button**: "Get Started" call-to-action button

### Key Features

1. **Dynamic Background**: Transparent when at top, dark gradient with blur when scrolled
2. **Mobile Sidebar**: Full-height sidebar with backdrop blur overlay
3. **Smart Navigation**: Handles section scrolling and page navigation intelligently
4. **Smooth Animations**: CSS transitions and backdrop filter effects
5. **Cross-browser Support**: Safari-specific viewport height handling

## Usage

### Basic Usage

```tsx
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      {/* Your page content */}
    </div>
  );
}
```

### Hero Variant

```tsx
import Navbar from '@/components/Navbar';

export default function HeroPage() {
  return (
    <div>
      <Navbar variant="hero" />
      {/* Your hero content */}
    </div>
  );
}
```

## Navigation Structure

The navbar includes these navigation items:

- **Research** - Scrolls to `#research` section
- **Calculator** - Scrolls to `#calculator` section  
- **Portfolio** - Scrolls to `#portfolio` section
- **Shariah** - Scrolls to `#shariah` section
- **About Us** - Scrolls to `#about` section
- **Bootcamp** - Links to `/bootcamp` page
- **Book Mentorship** - Links to `/meetings` page
- **Sign In** - Links to `/signin` page

## Customization

### Styling

The navbar uses Tailwind CSS classes and custom CSS variables:

- Background: `#0A0A0A` (dark theme)
- Accent color: `#667EEA` (purple-blue gradient)
- Card background: `#1F1F1F`
- Text colors: White and gray variants

### Navigation Items

To customize navigation items, edit the `Navbar.tsx` component and modify the navigation arrays in both mobile and desktop layouts.

### Logo

Currently uses text-based logo "YourApp". To add a custom logo:

1. Add your logo image to the `public` folder
2. Replace the `<span>YourApp</span>` elements with `<Image>` components
3. Update the logo paths in both mobile and desktop layouts

## Pages Included

This implementation includes several sample pages:

- **Home Page** (`/`) - Landing page with hero section and all content sections
- **Bootcamp Page** (`/bootcamp`) - Bootcamp program details and enrollment
- **Meetings Page** (`/meetings`) - Mentorship booking and expert consultation
- **Sign In Page** (`/signin`) - User authentication and account access
- **Blog Page** (`/blog`) - Blog listing page with sample posts
- **Contact Page** (`/contact`) - Contact form and company information

## CSS Features

The `globals.css` includes:

- Custom CSS variables for theming
- Smooth transitions for all interactive elements
- Custom scrollbar styling
- Focus styles for accessibility
- Animation keyframes for fade-in effects
- Responsive utilities for mobile-first design

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Safari-specific optimizations for mobile viewport
- Backdrop filter support for blur effects
- Progressive enhancement for older browsers

## Performance

- Optimized for performance with efficient event listeners
- Proper cleanup of event listeners
- Minimal re-renders with optimized state management
- CSS-based animations for smooth performance

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management for mobile menu
- High contrast color scheme
- Semantic HTML structure

## Development

To run the development server:

```bash
npm run dev
```

The navbar will be available at `http://localhost:3000` with all the sample pages demonstrating its functionality.

## Customization Guide

1. **Colors**: Update CSS variables in `globals.css`
2. **Navigation**: Modify navigation items in `Navbar.tsx`
3. **Logo**: Replace text logo with image logo
4. **Styling**: Customize Tailwind classes and add custom CSS
5. **Content**: Update page content in respective page files

This navbar implementation provides a solid foundation for modern web applications with excellent user experience and developer-friendly customization options.
