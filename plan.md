**Landing Page Plan (design only, all dummy)**


**1. Route and assets**
- Page: `src/app/page.tsx` (served at `localhost:3000`)
- Move your image to `public/images/tracker.jpg` and render it with `next/image`
Image is present in the cirrent directory tracker.jpg pick that one

**2. Layout, top to bottom**
- **Navbar:** Home and Expense on the left, **Sign up** and **Login** buttons on the right.
- **Hero:** the heading "Welcome To Expense Tracker", with the image centered below it.
- **Features:** 4 boxes below the hero, explaining why expense tracking matters:
  1. Track every spending
  2. Control your budget
  3. Save more money
  4. Your data stays private (ties to your multi-tenant design)
- Desktop shows 4 boxes in a row; mobile stacks them.

**3. Dummy behavior**
- Home, Expense, Sign up, and Login are plain `<button type="button">` elements with no links or handlers, so nothing redirects.

**4. Components** (in `src/components/`, following your component rules)
- `Navbar.tsx`
- `Hero.tsx`
- `FeatureCard.tsx`
- `FeaturesSection.tsx`
- All are Server Components with named exports and typed props. No Supabase yet.

**5. Styling**
- Blue theme to match your image, responsive, with accessible buttons and alt text. I'm assuming Tailwind (the `create-next-app` default).

