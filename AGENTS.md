# Project Context & AI Rules

## Core Guidelines
- **Frameworks:** React (Vite), TypeScript, Tailwind CSS, Lucide React icons.
- **Styling:** Use standard Tailwind utility classes.
- **Components:** Functional components with React Hooks.

## Translation & i18n
- The platform supports both Greek and English.
- Always use the `useLanguage` hook and the `t(greekString, englishString)` function for ANY user-facing text.
- Example: `{t('Καλώς ήρθατε', 'Welcome')}` or `placeholder={t('Αναζήτηση', 'Search')}`

## Design & UI Rules
- Keep UI modern, clean, and intuitive.
- Maintain mobile-first responsive design. Touch targets should be accessible.
- Ensure proper spacing, typography hierarchy, and branded colors (cyan-600, etc.).

## Continued Development
- Always check files before editing using `view_file`.
- Run TS checks/linting to ensure the build doesn't break.
