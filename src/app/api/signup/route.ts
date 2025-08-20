import { type NextRequest, NextResponse } from 'next/server'

interface SignupRequest {
  email: string
  acceptedTerms: boolean
  acceptedMarketing: boolean
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()
    const { email, acceptedTerms, acceptedMarketing, source } = body

    // Validate input
    if (!email || !acceptedTerms) {
      return NextResponse.json(
        { error: 'Email and terms acceptance are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Store in D1 Database
    if (process.env.D1_DATABASE_ID && process.env.CLOUDFLARE_API_TOKEN) {
      try {
        const d1Response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.D1_DATABASE_ID}/query`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sql: `INSERT INTO email_signups (email, accepted_terms, accepted_marketing, source, created_at) 
                    VALUES (?, ?, ?, ?, datetime('now'))`,
              params: [email, acceptedTerms, acceptedMarketing, source],
            }),
          }
        )

        if (!d1Response.ok) {
          console.error('D1 Database error:', await d1Response.text())
        }
      } catch (d1Error) {
        console.error('D1 Database connection error:', d1Error)
        // Continue even if D1 fails - don't block the user
      }
    }

    // Send to Pipedrive CRM
    if (process.env.PIPEDRIVE_API_TOKEN && process.env.PIPEDRIVE_DOMAIN) {
      try {
        // Create person in Pipedrive
        const pipedriveResponse = await fetch(
          `https://${process.env.PIPEDRIVE_DOMAIN}.pipedrive.com/v1/persons?api_token=${process.env.PIPEDRIVE_API_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: email.split('@')[0], // Use email prefix as name
              email: [
                {
                  value: email,
                  primary: true,
                  label: 'work',
                },
              ],
              visible_to: '3', // Everyone in company can see
              add_time: new Date().toISOString(),
              custom_fields: {
                source: 'dockets',
                accepted_marketing: acceptedMarketing,
                accepted_terms: acceptedTerms,
              },
            }),
          }
        )

        if (pipedriveResponse.ok) {
          const personData = await pipedriveResponse.json()
          
          // Create a deal for this person
          await fetch(
            `https://${process.env.PIPEDRIVE_DOMAIN}.pipedrive.com/v1/deals?api_token=${process.env.PIPEDRIVE_API_TOKEN}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: `Dockets Document Access - ${email}`,
                person_id: personData.data.id,
                status: 'open',
                visible_to: '3',
                add_time: new Date().toISOString(),
              }),
            }
          )
        } else {
          console.error('Pipedrive error:', await pipedriveResponse.text())
        }
      } catch (pipedriveError) {
        console.error('Pipedrive connection error:', pipedriveError)
        // Continue even if Pipedrive fails - don't block the user
      }
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully signed up',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}