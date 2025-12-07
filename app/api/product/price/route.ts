import { NextRequest, NextResponse } from 'next/server';

// Get pricing variables from environment variables
const BASE_PRICE = Number(process.env.PRODUCT_BASE_PRICE) || 180000; // Default if not set
const PRICE_PER_SQUARE_CM = Number(process.env.PRODUCT_PRICE_PER_SQUARE_CM) || 13.5; // Default if not set

export async function POST(request: NextRequest) {
  try {
    const { width, height } = await request.json();
    
    // Validate input
    if (!width || !height || typeof width !== 'number' || typeof height !== 'number') {
      return NextResponse.json(
        { error: 'Invalid dimensions provided' },
        { status: 400 }
      );
    }
    
    // Calculate price using server-side variables
    const price = BASE_PRICE + (width * height * PRICE_PER_SQUARE_CM);
    
    return NextResponse.json({ price });
  } catch (error) {
    console.error('Error calculating product price:', error);
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    );
  }
}