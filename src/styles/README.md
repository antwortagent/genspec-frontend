# GenSpec CSS Style Guide

This document outlines the CSS standards and best practices for the GenSpec frontend project.

## CSS Architecture

We use CSS Modules for component-specific styling, combined with global variables and utility classes.

### Directory Structure

- `/src/styles/global.css`: Contains global variables, utility classes, and base styles
- `/src/components/*/ComponentName.module.css`: Component-specific CSS modules
- `/src/pages/*/PageName.module.css`: Page-specific CSS modules

## CSS Variables

### Using Global Variables

All shared variables should be defined in `global.css` under the `:root` selector:

```css
:root {
  --primary-1: #2563EB;
  --radius-lg: 16px;
  /* etc. */
}
```

Use these variables in your component CSS files:

```css
.myComponent {
  color: var(--primary-1);
  border-radius: var(--radius-lg);
}
```

### Variable Naming Conventions

- Base colors: `--primary-1`, `--accent-2`, etc.
- Component states: `--status-idle`, `--status-thinking`, etc.
- Layout: `--section-padding`, `--content-max-width`, etc.
- Visual properties: `--radius-lg`, `--blur-md`, etc.

## Class Naming

- Use camelCase for class names in CSS modules
- Be specific and descriptive: `.headerNavigation` instead of `.nav`
- Use state modifiers with consistent patterns: `.button.primary`, `.card.elevated`, etc.

## Responsive Design

Use consistent breakpoints:

```css
/* Mobile first approach */
.container {
  padding: 1rem;
}

/* Tablet and above */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

## Best Practices

1. **Avoid inline styles** - Use CSS modules instead
2. **Avoid deep nesting** - Keep selectors simple and flat
3. **Use global variables** for consistency
4. **Apply mobile-first approach** to media queries
5. **Document unusual CSS** with comments

## Example Component

```css
/* MyComponent.module.css */
.container {
  background: var(--panel);
  border-radius: var(--radius-md);
  padding: var(--section-padding);
}

.title {
  color: var(--text);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.button {
  background: var(--primary-1);
  color: white;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
}

.button.secondary {
  background: transparent;
  color: var(--primary-1);
  border: 1px solid var(--primary-1);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
```
