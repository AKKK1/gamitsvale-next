// app/api/auth/facebook/route.ts
// Facebook OAuth — redirect to Facebook login

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL}/api/auth/facebook/callback`;

  const fbUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=public_profile` +
    `&response_type=code`;

  return NextResponse.redirect(fbUrl);
}