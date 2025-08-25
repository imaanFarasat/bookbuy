# Cloudflare SSL 525 Error Fix Guide

## Problem Identified
Your sitemap has 9 URLs returning HTTP 525 errors (SSL/TLS handshake failure):
- almond-nails
- chrome-nails  
- fake-nails
- gel-x-nails
- halloween-nails
- nail-paint
- shellac-nail-polish
- fall-nails
- summer-nails

## Solution Steps

### 1. Cloudflare SSL/TLS Settings
1. Go to Cloudflare Dashboard → Your Domain → SSL/TLS
2. Set **SSL/TLS encryption mode** to: **"Full (strict)"**
3. Set **Minimum TLS Version** to: **"1.2"**
4. Enable **"Always Use HTTPS"** in SSL/TLS → Edge Certificates

### 2. Cloudflare Page Rules (if needed)
Create page rules for the failing URLs:
- URL: `bookbuy.ca/nails/*`
- Settings: 
  - SSL: Full (strict)
  - Always Use HTTPS: On
  - Security Level: Medium

### 3. Netlify SSL Settings
1. Go to Netlify Dashboard → Your Site → Domain Management
2. Ensure **"Force HTTPS"** is enabled
3. Check that **"Let's Encrypt"** certificate is active
4. Verify **"Automatic TLS certificates"** is enabled

### 4. Test Individual URLs
Test these specific URLs in browser:
- https://bookbuy.ca/nails/almond-nails
- https://bookbuy.ca/nails/chrome-nails
- https://bookbuy.ca/nails/fake-nails

### 5. Cloudflare Cache Purge
1. Go to Cloudflare Dashboard → Caching → Configuration
2. Click **"Purge Everything"**
3. Wait 30 seconds and test again

### 6. Alternative: Bypass Cloudflare (Temporary)
If issues persist, temporarily set SSL/TLS to **"Flexible"** mode to bypass SSL issues.

## Expected Results
After fixing:
- All URLs should return HTTP 200
- Sitemap validation should show 100% success rate
- Google Search Console should accept sitemap

## Monitoring
- Re-run sitemap validation after changes
- Check Google Search Console for indexing status
- Monitor Cloudflare analytics for SSL errors
