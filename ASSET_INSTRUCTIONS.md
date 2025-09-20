# Asset Instructions for Hero Section

## Required Background Image

### File: Vector-1.jpg (or Vector 1.png as currently referenced)
- **Location**: Place in `/public` directory of the Next.js project
- **Path**: `/public/Vector-1.jpg` or `/public/Vector 1.png`
- **Description**: Abstract gradient background image for hero section
- **Recommended Dimensions**: 1920x1080 or higher for optimal quality
- **Format**: JPG or PNG
- **Quality**: High resolution to maintain crisp appearance across all devices

### Current Implementation Note
The HeroSection component currently references `/Vector 1.png` (note the space in filename).

### Image Usage
- The image is used as a full-screen background behind all hero content
- Positioned with `fill` property and `object-cover` for responsive scaling
- Has `-z-10` z-index to stay behind all other content
- Optimized with Next.js Image component for performance

### Placeholder Images for Animated Column
- The animated column currently uses placeholder `<div>` elements with `bg-zinc-800`
- These represent actual content images that would be loaded dynamically
- Each placeholder is 200px height with 80px border radius (`rounded-[80px]`)
- Would typically be replaced with real images using Next.js Image component

### Alternative Implementation
If you don't have Vector-1.jpg, you can temporarily:
1. Remove the Image component
2. Use a CSS gradient background instead
3. Or create a solid color background as placeholder

Example CSS fallback:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### File Structure
```
/public
  ├── Vector-1.jpg (or Vector 1.png)
  └── ... other assets
```