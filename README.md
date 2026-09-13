# GRIT — Sneaker Boutique (Web Technologies Assignment 01)

A fully static, multi-page e-commerce-style website built with plain HTML, CSS and JavaScript (no frameworks, no backend).

## Pages
- `index.html` — Home
- `shop.html` — Shop, with category filter + price/name sort
- `cart.html` — Cart, reads/writes items saved in the browser
- `about.html` — About
- `contact.html` — Contact, with validated form

## JavaScript features
1. Hamburger navigation menu (mobile)
2. Product filter by category + sort by price/name (shop page)
3. Add-to-cart with a quantity stepper, and a live cart counter in the nav
4. Cart page: remove items, auto-recalculated subtotal/shipping/total
5. Contact form validation (name, email format, message length) with inline errors
6. Back-to-top button that appears on scroll

## Run locally
No build step needed. Either open `index.html` directly, or serve locally:
python3 -m http.server 8000
then visit http://localhost:8000