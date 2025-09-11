# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern React website for "Век" (Vek) funeral service in Shuya, Russia. Built with Vite, React 18, and SCSS with focus on performance, accessibility, and local SEO optimization.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint:scss` - Lint and fix SCSS files with stylelint
- `npm run lint:js` - Lint and fix JavaScript/JSX files with eslint

## Architecture & Structure

### Core Stack
- **React 18** with Vite bundler and hot reload
- **SCSS** with modular architecture and CSS custom properties
- **Single-page application** with Global layout wrapper pattern

### Key Technical Patterns

**Global Component Wrapper**: `src/components/Global/Global.jsx` wraps all pages and provides:
- SEO meta tags and JSON-LD structured data
- Sticky header with scroll detection
- Footer with company information
- Accessibility features and print styles

**SCSS Import Hierarchy**: Strict order in `src/styles/main.scss`:
1. Variables (CSS custom properties) → Constants (Sass) → Functions → Media mixins → Mixins
2. Fonts → Normalize → Globals → Utils

**Business Data Centralization**: `src/helpers/index.js` exports `COMPANY_INFO` constant with all business details (phone, addresses, schedules) and utility functions for validation, formatting, and DOM manipulation.

### Image Strategy
- WebP with JPG/PNG fallbacks using picture elements
- Vite asset imports for proper bundling and optimization
- High-quality icons stored in `src/assets/icons/`

### SEO & Performance
- JSON-LD structured data for FuneralHome/LocalBusiness
- Russian language meta tags and OpenGraph
- Critical CSS inlined to prevent FOUC
- Print stylesheets and accessibility media queries

## Development Context

### Business Requirements
- **Target**: Grieving families (ages 35-65+) in Shuya/Ivanovo region
- **Primary goal**: Phone conversion (+7 920 366-36-36 - stored in COMPANY_INFO)
- **Key features**: 24/7 phone prominence, cost calculator, service catalog
- **Competitors**: ритуал-шуя.рф, вечность-шуя.рф

### Adding Components
1. Create page component in `src/pages/[ComponentName]/`
2. Co-locate SCSS file with same name
3. Wrap with `Global` component and pass SEO props
4. Import required business data from helpers

### Styling Workflow
- Use CSS custom properties from `variables.scss` for theming
- Leverage media query mixins from `media.scss` 
- Follow BEM methodology for component classes
- Utilize validation/formatting helpers for forms (Russian phone formats)

Documentation in `docs/` contains original technical specifications and content strategy.