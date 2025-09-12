# Investment Learning App Design Guidelines

## Design Approach: Reference-Based (Educational Platform)
**Primary Reference**: Khan Academy with modern fintech aesthetics
**Secondary Inspiration**: Duolingo for gamification, Robinhood for financial UI patterns

This utility-focused educational app prioritizes learning efficiency and progress tracking over visual flair.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 220 85% 25% (Deep educational blue)
- Secondary: 145 55% 45% (Success green for progress)
- Background: 0 0% 98% (Soft white)
- Surface: 0 0% 100% (Pure white cards)

**Dark Mode:**
- Primary: 220 70% 65% (Lighter blue for contrast)
- Secondary: 145 45% 55% (Muted green)
- Background: 222 15% 8% (Deep charcoal)
- Surface: 222 10% 12% (Card surfaces)

**Accent Colors (minimal use):**
- Warning: 35 85% 55% (Quiz alerts)
- Error: 5 75% 55% (Incorrect answers)

### B. Typography
**Fonts**: Inter (primary), JetBrains Mono (code/numbers)
- Headings: 600-700 weight, clear hierarchy
- Body: 400-500 weight, optimized for reading
- Quiz content: Slightly larger (16-18px) for accessibility

### C. Layout System
**Spacing Units**: Tailwind 3, 6, 8, 12 for consistent rhythm
- Cards: p-6, rounded-lg with subtle shadows
- Sections: space-y-8 for clear content separation
- Progress elements: compact spacing (p-3, gap-3)

### D. Component Library

**Navigation:**
- Fixed sidebar with module progress indicators
- Breadcrumb navigation showing learning path position
- Progress bars prominently displayed

**Learning Content:**
- Card-based module layout with completion badges
- Expandable content sections with clear typography
- Interactive elements highlighted with primary color

**Quiz Interface:**
- Clean question cards with generous whitespace
- Multiple choice with clear selection states
- Fill-in-the-blank with inline input styling
- Immediate feedback with color-coded results

**Dashboard:**
- Progress overview with visual achievement system
- Recommended modules prominently featured
- Performance analytics in digestible cards

**Chatbot:**
- Floating action button in bottom-right
- Modal overlay with chat interface
- Conversation bubbles with clear sender distinction

### E. Animations
Minimal and purposeful:
- Smooth progress bar fills
- Gentle card hover elevations
- Quiz result reveals with subtle bounce

## Images
**Hero Section**: Large illustration showing diverse people learning about investments (stocks/crypto charts in background). Use modern, friendly illustration style.

**Module Icons**: Simple line icons for each topic (trending chart for stocks, cryptocurrency symbol, percentage for interest rates). Place at module card headers.

**Achievement Badges**: Celebratory icons for milestones. Keep minimal and meaningful.

**No stock photos** - use illustrations that feel educational and approachable rather than corporate.

## Key Design Principles
1. **Learning-First**: Every design decision supports comprehension
2. **Progress Clarity**: Users always know where they are and what's next
3. **Encouraging**: Visual feedback celebrates small wins
4. **Accessible**: High contrast, clear fonts, logical tab order
5. **Distraction-Free**: Minimal visual noise to maintain focus