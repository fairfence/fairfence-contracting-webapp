# FairFence Contracting Waikato - Complete Design Specification

This document provides comprehensive details about the visual design, styling, content structure, and implementation patterns of the FairFence web application. Use this as a reference to recreate or maintain the webapp's look and feel.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component Styling](#component-styling)
5. [Design Patterns](#design-patterns)
6. [Content Structure](#content-structure)
7. [Animation & Interactions](#animation--interactions)
8. [Responsive Behavior](#responsive-behavior)

---

## Color System

### Primary Brand Colors

The application uses a **black-to-orange gradient theme** inspired by tiger stripes:

#### Light Mode Colors (HSL Format)
```css
/* Core Colors */
--background: 0 0% 98%;           /* Off-white background */
--foreground: 0 0% 15%;           /* Dark text */
--border: 0 0% 88%;               /* Light borders */

/* Primary Orange (Brand Color) */
--primary: 18 95% 48%;            /* HSL(18, 95%, 48%) - Vibrant orange */
--primary-foreground: 0 0% 98%;   /* White text on orange */

/* Card Colors */
--card: 0 0% 96%;                 /* Subtle off-white cards */
--card-foreground: 0 0% 15%;      /* Dark text on cards */
--card-border: 0 0% 92%;          /* Card borders */

/* Secondary & Muted */
--secondary: 0 0% 88%;            /* Light gray for secondary elements */
--secondary-foreground: 0 0% 15%; /* Dark text */
--muted: 0 0% 90%;                /* Muted backgrounds */
--muted-foreground: 0 0% 35%;     /* Muted text */

/* Accent Colors */
--accent: 25 12% 90%;             /* Warm neutral accent */
--accent-foreground: 25 8% 25%;   /* Dark text on accent */

/* Destructive/Error */
--destructive: 0 84% 35%;         /* Deep red for errors */
--destructive-foreground: 0 0% 98%; /* White on red */

/* Input & Ring (Focus) */
--input: 0 0% 80%;                /* Input borders */
--ring: 18 95% 48%;               /* Focus ring (same as primary) */
```

#### Dark Mode Colors
```css
--background: 0 0% 10%;           /* Nearly black background */
--foreground: 0 0% 90%;           /* Light text */
--border: 0 0% 18%;               /* Dark borders */

--card: 0 0% 12%;                 /* Slightly lighter than background */
--card-foreground: 0 0% 90%;      /* Light text */
--card-border: 0 0% 16%;          /* Subtle card borders */

--primary: 18 95% 48%;            /* Same vibrant orange */
--primary-foreground: 0 0% 98%;   /* White text */

--secondary: 0 0% 18%;            /* Dark gray */
--muted: 0 0% 16%;                /* Very dark muted */
--muted-foreground: 0 0% 65%;     /* Medium gray text */

--input: 0 0% 22%;                /* Darker input borders */
```

#### Gradient Combinations

**Navigation Bar:**
```css
background: linear-gradient(to right,
  rgba(0,0,0,0.95),      /* Black */
  rgba(87,25,13,0.95),   /* Orange-950 */
  rgba(0,0,0,0.95)       /* Black */
);
border-bottom: 1px solid rgba(87,25,13,0.4); /* Orange-900/40 */
```

**Hero Section Background:**
```css
/* Base gradients */
background: linear-gradient(to bottom-right, black, rgba(124,45,18,0.7), black);
background: linear-gradient(to top-right, black, rgba(154,52,18,0.4), black);

/* Accent blobs (positioned absolutely) */
- Top-right: 600px × 600px, orange-900/40, blur-3xl
- Bottom-left: 500px × 500px, orange-800/30, blur-3xl
- Center: 800px × 800px, orange-950/20, blur-3xl
```

**Tiger Stripe Pattern (Hero):**
```css
/* Diagonal stripes with opacity 20% */
- Stripe 1: Top 20, height 20, orange-900/50, rotate 2deg
- Stripe 2: Top 48, height 16, red-900/40, rotate -1deg
- Stripe 3: Bottom 32, height 24, orange-800/50, rotate 1deg
- Stripe 4: Bottom 10, height 12, red-950/40, rotate -2deg
```

**Button Gradients:**
```css
/* Primary CTA Button */
background: linear-gradient(to right,
  rgb(234,88,12),  /* orange-600 */
  rgb(220,38,38)   /* red-600 */
);

/* Hover state */
background: linear-gradient(to right,
  rgb(249,115,22), /* orange-500 */
  rgb(239,68,68)   /* red-500 */
);
```

### Status Colors
```css
--status-online: rgb(34 197 94);   /* Green */
--status-away: rgb(245 158 11);     /* Amber */
--status-busy: rgb(239 68 68);      /* Red */
--status-offline: rgb(156 163 175); /* Gray */
```

---

## Typography

### Font Families

**Primary Font:**
```css
font-family: 'Inter', system-ui, sans-serif;
```

**Fallback Fonts:**
```css
--font-sans: 'Open Sans', sans-serif;
--font-serif: Georgia, serif;
--font-mono: Menlo, monospace;
```

### Font Configuration
```javascript
// In Tailwind Config
fontFamily: {
  sans: ["Inter", "system-ui", "sans-serif"],
  serif: ["var(--font-serif)"],
  mono: ["var(--font-mono)"],
}
```

### Typography Scale

**Hero Title:**
```css
font-size: 2.25rem;      /* 36px on mobile (text-4xl) */
font-size: 3rem;         /* 48px on sm (text-5xl) */
font-size: 3.75rem;      /* 60px on lg (text-6xl) */
font-weight: 700;        /* bold */
line-height: 1.2;        /* tight */
```

**Section Headings:**
```css
font-size: 1.875rem;     /* 30px on mobile (text-3xl) */
font-size: 2.25rem;      /* 36px on sm (text-4xl) */
font-weight: 700;        /* bold */
margin-bottom: 1rem;
```

**Body Text:**
```css
font-size: 1rem;         /* 16px (text-base) */
line-height: 1.5;        /* 150% for readability */
```

**Large Body Text:**
```css
font-size: 1.125rem;     /* 18px (text-lg) */
font-size: 1.25rem;      /* 20px on sm (text-xl) */
color: hsl(var(--muted-foreground));
```

**Small Text:**
```css
font-size: 0.875rem;     /* 14px (text-sm) */
font-size: 0.75rem;      /* 12px (text-xs) */
```

### Text Rendering
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Spacing & Layout

### Spacing System

The application uses an **8px base grid system:**

```javascript
--spacing: 0.25rem; /* 4px - base unit */

// Common spacing values:
gap-1: 0.25rem;   /* 4px */
gap-2: 0.5rem;    /* 8px */
gap-3: 0.75rem;   /* 12px */
gap-4: 1rem;      /* 16px */
gap-6: 1.5rem;    /* 24px */
gap-8: 2rem;      /* 32px */
gap-12: 3rem;     /* 48px */
```

### Container Layout

```css
.container {
  max-width: 1280px;      /* 7xl */
  margin: 0 auto;
  padding-left: 1rem;     /* 16px on mobile */
  padding-right: 1rem;
}
```

### Section Spacing

```css
section {
  padding-top: 4rem;      /* 64px on mobile (py-16) */
  padding-bottom: 4rem;

  padding-top: 5rem;      /* 80px on sm (sm:py-20) */
  padding-bottom: 5rem;
}
```

### Border Radius

```javascript
borderRadius: {
  lg: "0.5625rem",  /* 9px */
  md: "0.375rem",   /* 6px */
  sm: "0.1875rem",  /* 3px */
}
```

### Shadows

```css
/* Light Mode */
--shadow-sm: 0px 2px 0px 0px hsl(0 0% 0% / 0.05),
             0px 1px 2px -1px hsl(0 0% 0% / 0.08);

--shadow-md: 0px 2px 0px 0px hsl(0 0% 0% / 0.05),
             0px 2px 4px -1px hsl(0 0% 0% / 0.10);

--shadow-lg: 0px 2px 0px 0px hsl(0 0% 0% / 0.05),
             0px 4px 6px -1px hsl(0 0% 0% / 0.12);

--shadow-xl: 0px 2px 0px 0px hsl(0 0% 0% / 0.05),
             0px 8px 10px -1px hsl(0 0% 0% / 0.15);

/* Dark Mode */
--shadow-sm: 0px 2px 0px 0px hsl(0 0% 0% / 0.30),
             0px 1px 2px -1px hsl(0 0% 0% / 0.40);
```

---

## Component Styling

### Navigation

```tsx
<nav className="fixed top-0 w-full
                bg-gradient-to-r from-black/95 via-orange-950/95 to-black/95
                backdrop-blur-md
                border-b border-orange-900/40
                z-50">
  {/* Logo Section */}
  <div className="flex items-center gap-2">
    <img className="h-10 md:h-12 w-auto object-contain rounded-md" />
    <div className="flex flex-col">
      <span className="font-bold text-lg leading-tight">FairFence</span>
      <span className="text-xs text-muted-foreground">Contracting Waikato</span>
    </div>
  </div>

  {/* Nav Links */}
  <a className="text-sm font-medium text-muted-foreground
                hover:text-primary transition-colors">
    Link Text
  </a>

  {/* CTA Button */}
  <Button className="gap-2
                     bg-gradient-to-r from-orange-600 to-red-600
                     hover:from-orange-500 hover:to-red-500
                     animate-pulse">
    <Phone className="h-4 w-4" />
    Text: 021 0835 8914
  </Button>
</nav>
```

**Height:** 64px (h-16 with padding)
**Padding:** py-3 (12px vertical)
**Position:** Fixed top, full width
**Z-index:** 50

### Hero Section

```tsx
<section className="relative min-h-[100vh] flex items-center
                    pt-20 pb-8 overflow-hidden">
  {/* Background layers */}
  <div className="absolute inset-0 z-0">
    {/* Tiger stripe gradients */}
  </div>

  {/* Content */}
  <div className="container max-w-7xl mx-auto px-4 relative z-10">
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left Column: Text */}
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
          Fair, Reliable Residential Fencing Team
        </h1>
        {/* Buttons, badges, etc. */}
      </div>

      {/* Right Column: Image Carousel */}
      <div className="hidden lg:block">
        <div className="relative rounded-2xl overflow-hidden h-[350px]">
          {/* Images with transition-opacity duration-1000 */}
        </div>
      </div>
    </div>
  </div>
</section>
```

**Min Height:** 100vh
**Grid:** 2 columns on lg+, single column on mobile
**Gap:** 8 (2rem) on mobile, 12 (3rem) on lg
**Background:** Complex gradient layers with tiger stripes

### Cards

```tsx
<Card className="group overflow-hidden
                 bg-black/60 backdrop-blur-sm
                 border-orange-950/30
                 hover-elevate active-elevate-2">
  {/* Image Section */}
  <div className="relative h-48 overflow-hidden">
    <img className="w-full h-full object-cover
                    group-hover:scale-110 transition-transform duration-300" />
    <div className="absolute inset-0 bg-gradient-to-t
                    from-amber-900/40 to-black/80" />
  </div>

  <CardHeader>
    <CardTitle className="text-xl">Card Title</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    <p className="text-muted-foreground leading-relaxed">Description</p>
    {/* Features list */}
    <Button variant="outline" className="w-full">Action</Button>
  </CardContent>
</Card>
```

**Background:** Semi-transparent black with backdrop blur
**Border:** Orange-950 at 30% opacity
**Image Height:** 192px (h-48)
**Hover:** Scale image 110%, elevate effect

### Badges

```tsx
{/* Outline Badge */}
<Badge variant="outline" className="gap-1">
  <Star className="h-3 w-3 text-primary" />
  5.0 Google Rating
</Badge>

{/* Secondary Badge */}
<Badge variant="secondary">
  87 Reviews
</Badge>
```

**Padding:** px-2.5 py-0.5
**Font Size:** 0.75rem (text-xs)
**Border Radius:** md (6px)

### Buttons

```tsx
{/* Primary CTA */}
<Button size="lg" className="gap-2 text-base
                             bg-gradient-to-r from-orange-600 to-red-600
                             hover:from-orange-500 hover:to-red-500">
  Get Free Quote
  <ArrowRight className="h-4 w-4" />
</Button>

{/* Outline Button */}
<Button variant="outline" size="lg" className="text-base">
  View Our Services
</Button>
```

**Size lg:** px-8, h-11 (44px height)
**Gap:** 0.5rem (8px) between icon and text
**Transition:** All colors transition-colors

---

## Design Patterns

### Elevation System

The app uses a custom elevation system for hover/active states:

```css
/* Hover Elevation */
.hover-elevate:hover::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: var(--elevate-1);
  border-radius: inherit;
  z-index: 999;
}

/* Active Elevation (stronger) */
.active-elevate-2:active::after {
  background-color: var(--elevate-2);
}

/* Toggle Elevation (for toggled states) */
.toggle-elevate.toggle-elevated::before {
  background-color: var(--elevate-2);
}
```

**Light Mode:**
```css
--elevate-1: rgba(0,0,0, .03);  /* Subtle darkening */
--elevate-2: rgba(0,0,0, .08);  /* Stronger darkening */
```

**Dark Mode:**
```css
--elevate-1: rgba(255,255,255, .04);  /* Subtle lightening */
--elevate-2: rgba(255,255,255, .09);  /* Stronger lightening */
```

### Background Decorative Elements

Used throughout sections:

```tsx
<div className="absolute inset-0 overflow-hidden">
  {/* Gradient blobs */}
  <div className="absolute top-0 left-0 w-[600px] h-[600px]
                  bg-gradient-to-br from-orange-900/20 to-transparent
                  rounded-full blur-3xl" />

  {/* Tiger stripes */}
  <div className="absolute top-20 left-0 w-full h-24
                  bg-gradient-to-r from-transparent via-orange-800/30 to-transparent
                  transform rotate-1" />
</div>
```

### Image Carousels

```tsx
const [currentImageIndex, setCurrentImageIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, 5000); // Change every 5 seconds
  return () => clearInterval(interval);
}, []);

// In JSX:
{images.map((image, index) => (
  <img
    className={`absolute inset-0 transition-opacity duration-1000 ${
      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
    }`}
  />
))}
```

**Transition Duration:** 1000ms (duration-1000)
**Interval:** 5000ms between changes
**Effect:** Crossfade opacity transition

---

## Content Structure

### Page Layout

```tsx
<div className="min-h-screen">
  <Navigation />
  <main>
    <Hero />
    <StatisticsBar variant="inline" />
    <AboutUs />
    <ProcessTimeline />
    <Services />
    <Testimonials />
    <PricingCalculator />
    <RequestQuote />
    <FAQ />
    <ServiceAreas />
    <Contact />
  </main>
  <Footer />
  <StatisticsBar variant="floating" />
</div>
```

### Section Structure Pattern

```tsx
<section id="section-id" className="py-16 sm:py-20
                                    bg-gradient-to-b from-black via-orange-950/40 to-black
                                    relative overflow-hidden">
  {/* Background decorations */}
  <div className="absolute inset-0">
    {/* Gradient blobs and stripes */}
  </div>

  <div className="container max-w-7xl mx-auto px-4 relative z-10">
    {/* Section header */}
    <div className="text-center max-w-3xl mx-auto mb-12">
      <Badge variant="outline" className="mb-4">Section Label</Badge>
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Section Title with <span className="bg-gradient-to-r from-orange-500 to-red-500
                                           bg-clip-text text-transparent">Gradient</span>
      </h2>
      <p className="text-lg text-muted-foreground">
        Section description text
      </p>
    </div>

    {/* Section content */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Cards or content */}
    </div>
  </div>
</section>
```

### Services Section

**Grid:** 2 columns on lg, 2 columns on md, 1 on mobile
**Gap:** 8 (2rem)

Each service card includes:
- Image overlay (h-48)
- Icon in top-left with backdrop-blur
- Title, description
- Feature list with checkmarks
- CTA button

### Testimonials

**Grid:** 3 columns on lg, 2 on md, 1 on mobile
**Gap:** 6 (1.5rem)

Testimonial card structure:
```tsx
<Card className="hover-elevate bg-black/60 backdrop-blur-sm">
  <CardContent className="pt-6">
    <Quote className="h-8 w-8 text-primary/20" />
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map(() => (
        <Star className="h-4 w-4 fill-primary text-primary" />
      ))}
    </div>
    <p className="text-sm mb-4 line-clamp-4">"Review text"</p>
    <div className="pt-4 border-t">
      <p className="font-semibold text-sm">Customer Name</p>
      <p className="text-xs text-muted-foreground">Location • Date</p>
    </div>
  </CardContent>
</Card>
```

---

## Animation & Interactions

### Smooth Scrolling

```javascript
const handleNavClick = (href: string) => {
  const element = document.querySelector(href);
  element?.scrollIntoView({ behavior: "smooth" });
};
```

### Button Animations

```css
/* Pulse animation on CTA */
animate-pulse

/* Hover transitions */
transition-colors  /* Duration: 150ms by default */
transition-transform duration-300

/* Scale on hover */
group-hover:scale-110
```

### Fade In Animation

```css
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Accordion Animations

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
}
```

---

## Responsive Behavior

### Breakpoints

```javascript
screens: {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large
  '2xl': '1536px' // 2X extra large
}
```

### Mobile Navigation

**Desktop (md+):**
- Horizontal nav links
- Visible phone button

**Mobile:**
- Hamburger menu icon
- Sheet/drawer navigation
- Full-width menu items
- Phone button in drawer

```tsx
{/* Desktop */}
<div className="hidden md:flex items-center gap-6">
  {/* Nav links */}
</div>

{/* Mobile */}
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger className="md:hidden">
    <Menu />
  </SheetTrigger>
  <SheetContent side="right" className="w-[280px] sm:w-[350px]">
    {/* Mobile menu */}
  </SheetContent>
</Sheet>
```

### Grid Responsiveness

```tsx
{/* Common patterns */}
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
className="flex flex-col sm:flex-row gap-3"
```

### Image Visibility

```tsx
{/* Hero image only on large screens */}
<div className="hidden lg:block">
  <div className="relative rounded-2xl overflow-hidden">
    {/* Image carousel */}
  </div>
</div>
```

### Text Size Responsiveness

```tsx
className="text-4xl sm:text-5xl lg:text-6xl"  // Hero
className="text-3xl sm:text-4xl"               // Section headings
className="text-lg sm:text-xl"                 // Large body text
```

---

## Key Business Information

### Contact Details

- **Phone:** 021 0835 8914
- **Email:** Admin@fairfence.co.nz
- **Location:** Ohaupo, New Zealand
- **Service Areas:** Hamilton, Cambridge, Te Awamutu, wider Waikato

### Business Details

- **Company Name:** FairFence
- **Full Name:** FairFence Contracting Waikato
- **Established:** 2019
- **Google Rating:** 5.0 ⭐
- **Review Count:** 87+ reviews

### Services Offered

1. **Quality Timber Fencing** - From $180/m
2. **Modern Aluminum Fencing** - From $220/m
3. **Low-Maintenance Vinyl** - From $250/m
4. **Rural & Lifestyle Fencing** - Quote on request

### Additional Services

- Fence Repairs
- Gate Installation
- Retaining Walls
- Deck Construction

---

## Technical Implementation Notes

### Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 3.4+ with shadcn/ui components
- **State:** TanStack Query for data fetching
- **Database:** Supabase PostgreSQL
- **Icons:** Lucide React
- **Animation:** Framer Motion, Tailwind Animate

### Image Assets

Images are located in `/attached_assets/` directory:

**Fencing Photos:**
- `fencing/timber-fence.jpeg`
- `fencing/aluminium-fence-gate.jpg`
- `fencing/vinyl-pvc-fence.webp`
- `fencing/files_7134594-1760607584209-IMG_0562.jpg`
- `fencing/timber-fence-gate.jpeg`

**Portfolio Photos:**
- `IMG_0032_1758750142435.jpeg`
- `IMG_0874_1758750142436.jpeg`
- `IMG_0852_1758750142436.jpeg`
- `IMG_0456_1758750142437.jpeg`

**Logo:**
- `IMG_0801_1758753451867.jpeg`

### Content Management

Content is managed through:
1. Supabase database tables
2. Custom `useSiteContent` hook
3. Admin dashboard at `/admin`

Fallback defaults are hardcoded in components using:
```typescript
const { getContent } = useSiteContent();
getContent('hero', 'title', 'Default Title');
```

---

## Design Philosophy

### Core Principles

1. **Mobile-First:** Design for mobile, enhance for desktop
2. **High Contrast:** Readable text on all backgrounds
3. **Tiger Branding:** Black and orange gradient theme throughout
4. **Performance:** Optimize images, lazy load where possible
5. **Accessibility:** ARIA labels, keyboard navigation, semantic HTML
6. **Professional:** Clean, modern, trustworthy appearance

### Visual Hierarchy

1. **Primary Actions:** Orange-to-red gradient buttons
2. **Secondary Actions:** Outline buttons
3. **Headings:** Bold, large, with occasional gradient text
4. **Body Text:** Muted foreground color for readability
5. **Decorative:** Subtle background elements, never overwhelming

---

## Final Notes

This specification covers the complete visual design system of the FairFence web application. To recreate the webapp:

1. Set up Tailwind CSS with the exact color variables
2. Implement the elevation system utilities
3. Use the gradient patterns for backgrounds
4. Follow the component structures and spacing
5. Apply responsive patterns consistently
6. Use the specified animations and transitions
7. Maintain the black-to-orange tiger stripe theme

All colors use HSL format for easier manipulation and dark mode support. The design emphasizes the brand's reliability and professionalism while maintaining visual interest through gradients and subtle animations.
