import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: 20 }}
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 13H8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17H8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 9H9H8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'system-ui',
              }}
            >
              FTXCLAIMS.COM
            </span>
          </div>
        </div>

        {/* Document Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 20,
              fontFamily: 'system-ui',
              lineHeight: 1.2,
            }}
          >
            Repko v. Kroll Restructuring Administration LLC
          </h1>
          <p
            style={{
              fontSize: 28,
              color: '#9ca3af',
              marginBottom: 30,
              fontFamily: 'system-ui',
            }}
          >
            Class Action Complaint
          </p>
        </div>

        {/* Court Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 40,
            padding: '20px 40px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 40,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 18, color: '#9ca3af', marginBottom: 4 }}>Court</span>
              <span style={{ fontSize: 20, color: 'white', fontWeight: 600 }}>
                U.S. District Court
              </span>
              <span style={{ fontSize: 18, color: 'white' }}>
                Western District of Texas
              </span>
            </div>
            <div
              style={{
                width: 1,
                height: 60,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 18, color: '#9ca3af', marginBottom: 4 }}>Case Number</span>
              <span style={{ fontSize: 20, color: 'white', fontWeight: 600 }}>
                1:25-cv-01319
              </span>
            </div>
            <div
              style={{
                width: 1,
                height: 60,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 18, color: '#9ca3af', marginBottom: 4 }}>Filed</span>
              <span style={{ fontSize: 20, color: 'white', fontWeight: 600 }}>
                August 19, 2025
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 16, color: '#6b7280' }}>Powered by</span>
          <span style={{ fontSize: 16, color: 'white', fontWeight: 600 }}>InstaLaw</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}