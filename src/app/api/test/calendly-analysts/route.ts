import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test/calendly-analysts
 * Test Calendly integration for all analysts
 * Returns status for each analyst (0-7)
 */
export async function GET(request: NextRequest) {
  try {
    const results = [];
    
    // Test each analyst (0-7)
    for (let analystId = 0; analystId <= 7; analystId++) {
      try {
        // Test credentials endpoint
        const credentialsResponse = await fetch(
          `${request.nextUrl.origin}/api/analysts/calendly-credentials?analystId=${analystId}`,
          { method: 'GET' }
        );
        
        const credentialsData = await credentialsResponse.json();
        
        if (credentialsResponse.ok) {
          // Test event types endpoint
          const eventTypesResponse = await fetch(
            `${request.nextUrl.origin}/api/calendly/event-types?analystId=${analystId}`,
            { method: 'GET' }
          );
          
          const eventTypesData = await eventTypesResponse.json();
          
          results.push({
            analystId,
            name: credentialsData.analyst.name,
            status: 'SUCCESS',
            calendlyEnabled: credentialsData.analyst.calendly.enabled,
            hasCredentials: true,
            eventTypesCount: eventTypesData.eventTypes?.length || 0,
            eventTypesStatus: eventTypesResponse.ok ? 'SUCCESS' : 'FAILED',
            eventTypesError: eventTypesResponse.ok ? null : eventTypesData.error,
            userUri: credentialsData.analyst.calendly.userUri
          });
        } else {
          results.push({
            analystId,
            name: credentialsData.analyst?.name || 'Unknown',
            status: 'FAILED',
            calendlyEnabled: credentialsData.analyst?.calendlyEnabled || false,
            hasCredentials: false,
            eventTypesCount: 0,
            eventTypesStatus: 'SKIPPED',
            eventTypesError: 'No credentials available',
            userUri: null,
            error: credentialsData.error
          });
        }
      } catch (error) {
        results.push({
          analystId,
          name: 'Unknown',
          status: 'ERROR',
          calendlyEnabled: false,
          hasCredentials: false,
          eventTypesCount: 0,
          eventTypesStatus: 'ERROR',
          eventTypesError: error instanceof Error ? error.message : 'Unknown error',
          userUri: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Summary statistics
    const summary = {
      total: results.length,
      success: results.filter(r => r.status === 'SUCCESS').length,
      failed: results.filter(r => r.status === 'FAILED').length,
      errors: results.filter(r => r.status === 'ERROR').length,
      enabled: results.filter(r => r.calendlyEnabled).length,
      withEventTypes: results.filter(r => r.eventTypesCount > 0).length
    };
    
    return NextResponse.json({
      success: true,
      summary,
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error testing Calendly analysts:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
