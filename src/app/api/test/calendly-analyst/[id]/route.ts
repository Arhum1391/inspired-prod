import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test/calendly-analyst/[id]
 * Test Calendly integration for a specific analyst
 * Returns detailed status and test results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analystId = params.id;
    
    if (!analystId || isNaN(Number(analystId))) {
      return NextResponse.json(
        { error: 'Valid analyst ID is required' },
        { status: 400 }
      );
    }
    
    const results = {
      analystId: Number(analystId),
      tests: [] as any[],
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        errors: 0
      }
    };
    
    // Test 1: Check credentials
    try {
      const credentialsResponse = await fetch(
        `${request.nextUrl.origin}/api/analysts/calendly-credentials?analystId=${analystId}`,
        { method: 'GET' }
      );
      
      const credentialsData = await credentialsResponse.json();
      
      results.tests.push({
        test: 'Credentials Check',
        status: credentialsResponse.ok ? 'PASSED' : 'FAILED',
        details: credentialsResponse.ok ? {
          name: credentialsData.analyst.name,
          calendlyEnabled: credentialsData.analyst.calendly.enabled,
          hasUserUri: !!credentialsData.analyst.calendly.userUri,
          hasAccessToken: !!credentialsData.credentials.accessToken
        } : {
          error: credentialsData.error
        }
      });
      
      if (credentialsResponse.ok) {
        results.summary.passed++;
        
        // Test 2: Check event types
        try {
          const eventTypesResponse = await fetch(
            `${request.nextUrl.origin}/api/calendly/event-types?analystId=${analystId}`,
            { method: 'GET' }
          );
          
          const eventTypesData = await eventTypesResponse.json();
          
          results.tests.push({
            test: 'Event Types Fetch',
            status: eventTypesResponse.ok ? 'PASSED' : 'FAILED',
            details: eventTypesResponse.ok ? {
              eventTypesCount: eventTypesData.eventTypes?.length || 0,
              eventTypes: eventTypesData.eventTypes?.map((et: any) => ({
                name: et.name,
                duration: et.duration,
                active: et.active
              })) || []
            } : {
              error: eventTypesData.error,
              statusCode: eventTypesResponse.status
            }
          });
          
          if (eventTypesResponse.ok) {
            results.summary.passed++;
            
            // Test 3: Check availability (if event types exist)
            if (eventTypesData.eventTypes && eventTypesData.eventTypes.length > 0) {
              try {
                const eventTypeUri = eventTypesData.eventTypes[0].id;
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const startDate = tomorrow.toISOString().split('T')[0];
                
                const availabilityResponse = await fetch(
                  `${request.nextUrl.origin}/api/calendly/availability?analystId=${analystId}&eventTypeUri=${encodeURIComponent(eventTypeUri)}&startDate=${startDate}`,
                  { method: 'GET' }
                );
                
                const availabilityData = await availabilityResponse.json();
                
                results.tests.push({
                  test: 'Availability Check',
                  status: availabilityResponse.ok ? 'PASSED' : 'FAILED',
                  details: availabilityResponse.ok ? {
                    availableDates: availabilityData.availableDates?.length || 0,
                    totalSlots: availabilityData.totalSlots || 0,
                    sampleDates: availabilityData.availableDates?.slice(0, 3) || []
                  } : {
                    error: availabilityData.error,
                    statusCode: availabilityResponse.status
                  }
                });
                
                if (availabilityResponse.ok) {
                  results.summary.passed++;
                } else {
                  results.summary.failed++;
                }
              } catch (error) {
                results.tests.push({
                  test: 'Availability Check',
                  status: 'ERROR',
                  details: {
                    error: error instanceof Error ? error.message : 'Unknown error'
                  }
                });
                results.summary.errors++;
              }
            } else {
              results.tests.push({
                test: 'Availability Check',
                status: 'SKIPPED',
                details: {
                  reason: 'No event types available to test'
                }
              });
            }
          } else {
            results.summary.failed++;
          }
        } catch (error) {
          results.tests.push({
            test: 'Event Types Fetch',
            status: 'ERROR',
            details: {
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          });
          results.summary.errors++;
        }
      } else {
        results.summary.failed++;
      }
    } catch (error) {
      results.tests.push({
        test: 'Credentials Check',
        status: 'ERROR',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      results.summary.errors++;
    }
    
    results.summary.totalTests = results.tests.length;
    
    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error testing analyst Calendly integration:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
