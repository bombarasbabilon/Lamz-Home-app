# Health Tracker PWA

A mobile-first Progressive Web App for tracking daily meals and health goals, optimized for iPhone with "Add to Home Screen" functionality.

## Features

✅ **Daily Meal Tracking** - 7 meal time slots (Early Morning, Breakfast, Mid Morning, Lunch, Tea, Dinner, Supper)  
✅ **Color-Coded Compliance** - Blue for compliant days, Orange for non-compliant  
✅ **Quick Entry** - Predefined food options from your diet plan  
✅ **Custom Food Items** - Add any food not in the suggestions  
✅ **Notes** - Add observations for each meal  
✅ **Date Navigation** - Easy switching between days  
✅ **Export** - Download your data as JSON or CSV  
✅ **Offline Support** - Works without internet connection  
✅ **PWA** - Install on iPhone home screen like a native app  

## Getting Started

### Development

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Installing on iPhone

1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. The app will appear on your home screen like a native app!

## How to Use

1. **Navigate Dates** - Use the left/right arrows or "Today" button
2. **Toggle Compliance** - Tap the colored card at the top to mark day as compliant/non-compliant
3. **Log Meals** - Tap "Add" or "Edit" on any meal card
4. **Select Foods** - Choose from suggested foods or add custom items
5. **Add Notes** - Include any observations or notes for the meal
6. **Export Data** - Use the JSON or CSV buttons to download your tracking data

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **PWA** - Progressive Web App capabilities
- **Local Storage** - Client-side data persistence

## Project Structure

```
health-tracker-pwa/
├── app/
│   ├── layout.tsx          # Root layout with PWA metadata
│   ├── page.tsx            # Main app page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── meal-card.tsx       # Meal tracking card component
├── lib/
│   ├── types.ts            # TypeScript types and constants
│   └── storage.ts          # Local storage utilities
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── icon-192x192.svg    # App icon (small)
│   └── icon-512x512.svg    # App icon (large)
└── next.config.ts          # Next.js and PWA configuration
```

## Diet Plan Integration

The app includes predefined food options based on your diet plan:

- **Early Morning**: Water + methi seeds
- **Breakfast**: Egg whites, vegetables, multigrain bread, oats
- **Mid Morning**: Fruit, almonds, walnuts
- **Lunch**: Salad, quinoa/millets, vegetables, dal/beans
- **Tea**: Greek yogurt with seeds, lentil chips
- **Dinner**: Multiple healthy options (soup, grilled proteins, vegetables)
- **Supper**: Light snacks if needed

## Data Storage

- All data is stored locally in your browser's Local Storage
- No server or database required
- Data persists across sessions
- Export functionality for backup

## Development

This project was created with:
- `create-next-app`
- `@ducanh2912/next-pwa` for PWA support
- `shadcn/ui` for component library
- `lucide-react` for icons

## License

Private project for personal use.
