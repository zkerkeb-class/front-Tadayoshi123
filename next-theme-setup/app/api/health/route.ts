import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint for the frontend gateway.
 *     description: Returns the current status of the frontend service.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: frontend-gateway
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
export async function GET() {
  try {
    // In a real-world scenario, you might check other dependencies here.
    // For now, a simple "ok" is sufficient.
    return NextResponse.json({ 
      status: 'ok', 
      service: 'frontend-gateway', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Frontend health check failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      service: 'frontend-gateway',
      error: errorMessage
    }, { status: 503 });
  }
} 