# Landing Page Implementation Todo List

## Project Overview
Create a modern, responsive landing page based on Figma design specifications using Tailwind CSS. The page must be built from scratch without using the provided CSS directly - only as a reference for colors, fonts, spacing, and design elements.

## Critical Requirements Summary
- **Framework**: Pure HTML5 with Tailwind CSS utilities
- **Design**: Mobile-first responsive approach
- **Font**: Inter (replacing Gilroy from design)
- **Images**: Placeholder images from https://placehold.co/
- **Layout**: Flexbox/Grid utilities (NO absolute positioning for main layout)
- **Interactivity**: Tailwind state modifiers for hover effects
- **Custom CSS**: Minimal - only for complex animations/gradients

## Implementation Action Items

### 1. Project Setup & Structure
- [ ] Set up HTML5 document structure with semantic elements
- [ ] Include Google Fonts link for Inter font family
- [ ] Add Tailwind CSS CDN or build setup
- [ ] Create proper meta tags for responsive design
- [ ] Set up favicon and basic SEO meta tags

### 2. Header & Navigation (Frame 31)
- [ ] Create semantic `<header>` element
- [ ] Implement logo placeholder (212x32px white background)
- [ ] Build navigation menu with 5 items:
  - [ ] Research
  - [ ] Calculator
  - [ ] Portfolio
  - [ ] Shariah
  - [ ] Our Team
- [ ] Create "Book 1:1 Meeting" CTA button (white background, rounded)
- [ ] Make navigation responsive (mobile menu for smaller screens)
- [ ] Apply proper spacing and alignment using Tailwind utilities

### 3. Hero Section (Frame 25)
- [ ] Create main hero container with proper padding/margins
- [ ] Implement large heading: "Making Finance & Tech Accessible Through Data-Driven Content"
- [ ] Add subtitle text: "Expert analysis on stocks, crypto, and data science - delivered with clarity and humor"
- [ ] Create two-button CTA section (Frame 47):
  - [ ] "Book a 1v1 Call" (white background, black text)
  - [ ] "Learn More" (outlined white border, white text)
- [ ] Apply proper typography hierarchy using Tailwind text utilities
- [ ] Ensure mobile responsiveness with appropriate text scaling

### 4. Hero Side Content (Mask group & Frame 46)
- [ ] Create scrolling image gallery on right side
- [ ] Implement three columns of images with vertical arrangement
- [ ] Add placeholder images (88x200px rounded rectangles)
- [ ] Create gradient overlay effect (linear-gradient fade)
- [ ] Implement continuous vertical scrolling animation using custom CSS
- [ ] Ensure proper masking/clipping for smooth transitions

### 5. Main Content Section (Frame 86)
- [ ] Create large centered heading with decorative images
- [ ] Add rotated image elements around the text
- [ ] Implement 2x2 grid of feature cards:
  - [ ] Data-Driven Approach
  - [ ] Educational Focus
  - [ ] Real-Time Coverage
  - [ ] Community-First
- [ ] Style each card with dark background (#1F1F1F)
- [ ] Add proper spacing and typography for card content

### 6. About Section (Frame 74)
- [ ] Create two-column layout (text + feature grid)
- [ ] Add long-form descriptive text about services
- [ ] Include "Book 1:1 Meeting" CTA button
- [ ] Ensure proper text line-height and spacing
- [ ] Make responsive for mobile (stack columns vertically)

### 7. Social Proof Section (Frame 26)
- [ ] Create horizontal logo gallery
- [ ] Add placeholder logos with proper opacity
- [ ] Implement responsive spacing between logos
- [ ] Ensure logos scale appropriately on mobile

### 8. Video Section (Frame 68)
- [ ] Create "Latest Videos" section header
- [ ] Implement horizontally scrollable container
- [ ] Add video thumbnail placeholders
- [ ] Use Tailwind's scroll-snap utilities
- [ ] Style with proper spacing and hover effects

### 9. Newsletter Section (Newsletter Banner)
- [ ] Create prominent newsletter signup section
- [ ] Add gradient background with blur effects
- [ ] Implement email input field with validation styling
- [ ] Create "Subscribe" button with proper styling
- [ ] Add disclaimer text with appropriate opacity
- [ ] Include decorative background elements

### 10. Footer
- [ ] Create basic footer structure (if specified in full design)
- [ ] Add necessary links and information
- [ ] Ensure consistent styling with rest of page

### 11. Responsive Design Implementation
- [ ] Test and refine mobile layout (320px and up)
- [ ] Optimize tablet layout (768px and up)
- [ ] Ensure desktop layout matches design (1024px and up)
- [ ] Test on various screen sizes and devices
- [ ] Verify touch targets are appropriate size on mobile

### 12. Interactive Elements & Animations
- [ ] Add hover effects to all buttons and links
- [ ] Implement smooth transitions using Tailwind utilities
- [ ] Create custom CSS for hero image scrolling animation
- [ ] Add focus states for accessibility
- [ ] Test all interactive elements

### 13. Performance & Optimization
- [ ] Optimize placeholder image sizes and formats
- [ ] Minimize custom CSS to essential animations only
- [ ] Ensure fast loading with proper resource prioritization
- [ ] Test page performance and loading speed

### 14. Cross-Browser Testing
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Verify mobile browser compatibility
- [ ] Check for any layout inconsistencies
- [ ] Validate HTML and ensure semantic correctness

### 15. Final Quality Assurance
- [ ] Compare final result with original Figma design
- [ ] Verify all text content is included and accurate
- [ ] Test all interactive elements and animations
- [ ] Ensure accessibility standards are met
- [ ] Code review for clean, organized structure

## Technical Notes

### Color Palette (from CSS reference)
- Background: `#0A0A0A` (very dark)
- Text: `#FFFFFF` (white)
- Cards: `#1F1F1F` (dark gray)
- Accent: Various gradients for special elements

### Typography Hierarchy
- Hero Title: 48px, font-weight 600, line-height 120%
- Section Headers: 32-36px, font-weight 600
- Body Text: 16px, font-weight 400, line-height 130%
- Button Text: 14px, font-weight 600

### Key Measurements
- Container Width: 1064px max-width
- Card Dimensions: 246x131px typically
- Button Heights: 36-48px
- Border Radius: 16px for cards, 100px for buttons

### Custom CSS Requirements
- Vertical scrolling animation for hero side images
- Complex gradient backgrounds for newsletter section
- Blur effects for decorative elements

## Success Criteria
✅ Page matches Figma design visually
✅ Fully responsive across all device sizes
✅ Built entirely with Tailwind CSS utilities
✅ Smooth animations and interactions
✅ Fast loading and good performance
✅ Semantic HTML structure
✅ Accessible to screen readers and keyboard navigation