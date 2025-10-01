# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application named "repurpose-engine" using:
- React 19
- TypeScript with strict mode enabled
- Tailwind CSS v4 (with PostCSS)
- Next.js App Router architecture
- Turbopack for faster builds/development

## Key Commands

### Development
```bash
npm run dev      # Start dev server with Turbopack on port 3000
npm run build    # Production build with Turbopack
npm start        # Start production server
npm run lint     # Run ESLint
```

### Testing Port 3000
If a process is already running on port 3000, use that existing process for testing rather than spinning up a new one on a different port.

## Architecture

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind v4 and CSS custom properties
- TypeScript path alias: `@/*` maps to `./src/*`

### Styling
- Uses Tailwind CSS v4 with the new `@import "tailwindcss"` syntax
- CSS custom properties for theming (light/dark mode via prefers-color-scheme)
- Geist Sans and Geist Mono fonts loaded via `next/font/google`
- Design tokens defined in `globals.css` using `@theme inline` directive

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Path aliases configured: `@/*` → `./src/*`
- JSX: preserve (handled by Next.js)
- Module resolution: bundler

## Development Notes

- This project uses Next.js 15's stable App Router
- Turbopack is enabled by default for both dev and build
- ESLint extends `next/core-web-vitals` and `next/typescript`
- Images are optimized through `next/image`

## Visual Development

### Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.