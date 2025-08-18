# Google Reviews Setup Guide

This guide will help you configure Google Reviews to display your actual business reviews on the homepage.

## Step 1: Get Your Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "API Key"
5. Copy your API key
6. Go to "APIs & Services" > "Library"
7. Search for "Places API" and enable it
8. (Optional but recommended) Restrict your API key to only the Places API for security

## Step 2: Find Your Google Place ID

1. Go to the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id#find-id)
2. Search for your business: "Arsh Consultancy & Contractors"
3. Copy the Place ID that appears

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with:

```
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
VITE_GOOGLE_PLACE_ID=your_place_id_here
```

Note: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Step 4: Important Security Note

⚠️ **For Production**: The current implementation exposes your API key on the client side. For production, you should:

1. Create a backend API endpoint that calls Google Places API
2. Store the API key securely on your server
3. Have your React app call your backend instead of Google directly

## Alternative: Third-Party Widgets

If you prefer a simpler solution without API keys, consider these alternatives:

### Option 1: Elfsight Widget

1. Go to [Elfsight Google Reviews](https://elfsight.com/google-reviews-widget/)
2. Create a widget for your business
3. Get the embed code
4. Replace the GoogleReviews component with the embed code

### Option 2: EmbedSocial

1. Go to [EmbedSocial](https://embedsocial.com/)
2. Create a Google Reviews widget
3. Customize the appearance
4. Get the embed code

### Option 3: Manual Embed

1. Go to your business on Google Maps
2. Click on individual reviews
3. Use "Share review" > "Embed" to get individual review codes

## Testing

After setup, restart your development server:

```bash
npm run dev
```

The reviews should appear on your homepage above the Services section.

## URL Behavior

The "View on Google" and "Read All Reviews" buttons will take users directly to your Google Business Profile reviews, not Google Maps. This provides a better experience for reading and writing reviews.

**URL Formats Used:**

- **With Place ID**: `https://search.google.com/local/reviews?placeid=YOUR_PLACE_ID`
- **Without Place ID**: `https://www.google.com/search?q=BUSINESS_NAME+reviews#lrd=0x0:0x0,1`

## Troubleshooting

- **API Key Issues**: Make sure the Places API is enabled for your key
- **CORS Errors**: This is expected in development; implement a backend proxy for production
- **No Reviews Showing**: Check your Place ID is correct and your business has public reviews
- **Rate Limiting**: Google Places API has usage quotas; consider caching results
- **Wrong URL**: If links go to Maps instead of reviews, check that the URL generation is working properly

## Support

If you need help with setup, you can:

1. Check the browser console for error messages
2. Verify your API key permissions
3. Test your Place ID with Google's documentation tools
