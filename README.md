# VendorGrocer (B2B Grocery Ordering App)

This repository now includes a starter **online grocery ordering app** for restaurants and vendors, inspired by a B2B ordering workflow similar to the example you shared.

## Features

- Login page for Restaurant or Vendor role
- One-click demo login buttons for Restaurant and Vendor personas
- Product catalog with quantities and add-to-cart
- Cart summary with subtotal and line removal
- Place order action with confirmation message
- Recent order history table
- Local state persistence using browser `localStorage`

## Project Structure

- `app/index.html` – app layout (login + dashboard + orders)
- `app/styles.css` – responsive UI styling
- `app/app.js` – client-side logic and local order flow

## Run Locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/app/`

Use **Demo Restaurant** or **Demo Vendor** to explore instantly without typing credentials.

## Notes

This is a frontend MVP/prototype intended to help you start quickly.
For production use, the next step would be to add:

- secure backend authentication
- vendor/restaurant account management
- real product/inventory APIs
- payment + invoicing integrations
- order status webhooks and notifications
