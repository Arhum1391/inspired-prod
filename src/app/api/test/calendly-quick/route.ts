import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test/calendly-quick
 * Quick test to check which analysts have working Calendly integration
 * Returns a simple overview
 */
export async function GET(request: NextRequest) {
  try {
    const quickResults = [];
    
    // Quick test for each analyst (0-7)
    for (let analystId = 0; analystId <= 7; analystId++) {
      try {
        // Just test credentials - fastest check
        const credentialsResponse = await fetch(
          `${request.nextUrl.origin}/api/analysts/calendly-credentials?analystId=${analystId}`,
          { method: 'GET' }
        );
        
        const credentialsData = await credentialsResponse.json();
        
        if (credentialsResponse.ok) {
          // Quick event types test
          const eventTypesResponse = await fetch(
            `${request.nextUrl.origin}/api/calendly/event-types?analystId=${analystId}`,
            { method: 'GET' }
          );
          
          const eventTypesData = await eventTypesResponse.json();
          
          quickResults.push({
            analystId,
            name: credentialsData.analyst.name,
            status: eventTypesResponse.ok ? '✅ WORKING' : '⚠️ CREDENTIALS OK, API FAILED',
            eventTypes: eventTypesResponse.ok ? eventTypesData.eventTypes?.length || 0 : 0,
            enabled: credentialsData.analyst.calendly.enabled
          });
        } else {
          quickResults.push({
            analystId,
            name: credentialsData.analyst?.name || 'Unknown',
            status: '❌ NO CREDENTIALS',
            eventTypes: 0,
            enabled: false
          });
        }
      } catch (error) {
        quickResults.push({
          analystId,
          name: 'Unknown',
          status: '❌ ERROR',
          eventTypes: 0,
          enabled: false
        });
      }
    }
    
    // Summary
    const working = quickResults.filter(r => r.status === '✅ WORKING').length;
    const total = quickResults.length;
    
    return NextResponse.json({
      success: true,
      summary: {
        total,
        working,
        notWorking: total - working,
        percentage: Math.round((working / total) * 100)
      },
      results: quickResults,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in quick Calendly test:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
