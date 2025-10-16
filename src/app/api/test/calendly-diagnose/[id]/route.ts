import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test/calendly-diagnose/[id]
 * Diagnose why a specific analyst's Calendly integration is failing
 * Returns detailed error information
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
    
    const diagnosis = {
      analystId: Number(analystId),
      steps: [] as any[],
      conclusion: '',
      recommendations: [] as string[]
    };
    
    // Step 1: Check credentials
    try {
      const credentialsResponse = await fetch(
        `${request.nextUrl.origin}/api/analysts/calendly-credentials?analystId=${analystId}`,
        { method: 'GET' }
      );
      
      const credentialsData = await credentialsResponse.json();
      
      if (credentialsResponse.ok) {
        diagnosis.steps.push({
          step: 'Credentials Check',
          status: 'PASSED',
          details: {
            name: credentialsData.analyst.name,
            hasUserUri: !!credentialsData.analyst.calendly.userUri,
            hasAccessToken: !!credentialsData.credentials.accessToken,
            userUri: credentialsData.analyst.calendly.userUri,
            accessTokenLength: credentialsData.credentials.accessToken?.length || 0
          }
        });
        
        // Step 2: Test direct Calendly API call
        try {
          const { userUri, accessToken } = credentialsData.credentials;
          
          // Test 1: Get user info
          const userInfoResponse = await fetch('https://api.calendly.com/users/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          const userInfoData = await userInfoResponse.json();
          
          diagnosis.steps.push({
            step: 'Direct Calendly API - User Info',
            status: userInfoResponse.ok ? 'PASSED' : 'FAILED',
            details: userInfoResponse.ok ? {
              apiUserUri: userInfoData.resource?.uri,
              apiUserName: userInfoData.resource?.name,
              apiUserEmail: userInfoData.resource?.email,
              uriMatches: userInfoData.resource?.uri === userUri
            } : {
              statusCode: userInfoResponse.status,
              error: userInfoData
            }
          });
          
          if (userInfoResponse.ok) {
            // Test 2: Get event types
            const eventTypesResponse = await fetch(
              `https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}&active=true`,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            const eventTypesData = await eventTypesResponse.json();
            
            diagnosis.steps.push({
              step: 'Direct Calendly API - Event Types',
              status: eventTypesResponse.ok ? 'PASSED' : 'FAILED',
              details: eventTypesResponse.ok ? {
                eventTypesCount: eventTypesData.collection?.length || 0,
                eventTypes: eventTypesData.collection?.map((et: any) => ({
                  name: et.name,
                  slug: et.slug,
                  duration: et.duration,
                  active: et.active,
                  uri: et.uri
                })) || []
              } : {
                statusCode: eventTypesResponse.status,
                error: eventTypesData
              }
            });
            
            // Determine conclusion and recommendations
            if (eventTypesResponse.ok) {
              const eventTypesCount = eventTypesData.collection?.length || 0;
              
              if (eventTypesCount === 0) {
                diagnosis.conclusion = 'No event types found in Calendly account';
                diagnosis.recommendations.push('Create at least one event type in the Calendly account');
                diagnosis.recommendations.push('Make sure the event type is set to "Active"');
                diagnosis.recommendations.push('Verify the event type is not in draft mode');
              } else {
                diagnosis.conclusion = 'Event types found - integration should work';
                diagnosis.recommendations.push('Check if the event types are properly configured');
                diagnosis.recommendations.push('Verify the event types have availability set');
              }
            } else {
              diagnosis.conclusion = 'Calendly API error when fetching event types';
              diagnosis.recommendations.push('Check if the access token has proper permissions');
              diagnosis.recommendations.push('Verify the user URI is correct');
              diagnosis.recommendations.push('Check if the Calendly account is active');
            }
          } else {
            diagnosis.conclusion = 'Access token is invalid or expired';
            diagnosis.recommendations.push('Generate a new access token from Calendly');
            diagnosis.recommendations.push('Make sure the token has not expired');
            diagnosis.recommendations.push('Verify the token was copied correctly');
          }
          
        } catch (error) {
          diagnosis.steps.push({
            step: 'Direct Calendly API Test',
            status: 'ERROR',
            details: {
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          });
          diagnosis.conclusion = 'Network or system error';
          diagnosis.recommendations.push('Check network connectivity');
          diagnosis.recommendations.push('Verify Calendly API is accessible');
        }
      } else {
        diagnosis.steps.push({
          step: 'Credentials Check',
          status: 'FAILED',
          details: {
            error: credentialsData.error
          }
        });
        diagnosis.conclusion = 'No valid credentials found';
        diagnosis.recommendations.push('Add Calendly credentials to the database');
        diagnosis.recommendations.push('Verify the analyst ID is correct');
      }
    } catch (error) {
      diagnosis.steps.push({
        step: 'Credentials Check',
        status: 'ERROR',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      diagnosis.conclusion = 'System error occurred';
      diagnosis.recommendations.push('Check database connection');
      diagnosis.recommendations.push('Verify the API endpoints are working');
    }
    
    return NextResponse.json({
      success: true,
      ...diagnosis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error diagnosing analyst Calendly integration:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
