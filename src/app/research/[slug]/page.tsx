import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { researchReports } from '@/data/researchReports';

type ResearchDetailPageParams = {
  slug: string;
};

export default async function ResearchDetailPage({ params }: { params: Promise<ResearchDetailPageParams> }) {
  const { slug } = await params;
  const report = researchReports.find(item => item.slug === slug);

  if (!report) {
    notFound();
  }

  const relatedArticles = researchReports.filter(item => item.slug !== report.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          /* Read More Research Articles - mobile column layout */
          .research-related {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding: 0 16px !important;
            gap: 32px !important;
            width: 100% !important; /* match width of section above */
          }
          .research-related-title {
            width: 100% !important;
            max-width: 100% !important; /* align with above section */
            height: auto !important;
            font-size: 32px !important;
            line-height: 130% !important;
            margin: 0 !important;
          }
          .research-related-list {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 0 !important;
            gap: 20px !important;
            width: 100% !important;
            max-width: 100% !important; /* align with above section */
          }
          .research-related-card {
            width: 100% !important; /* expand to container width */
            height: 311px !important; /* increased mobile card height */
            padding: 20px 12px !important;
            border-radius: 10px !important;
            flex: 0 0 auto !important;
            /* Ensure space below the button at bottom on mobile */
            padding-bottom: 28px !important;
          }
          .research-related-card-inner {
            width: 100% !important; /* fill card width */
            height: auto !important;
            gap: 16px !important;
          }
          .research-related-card-inner h3 {
            font-size: 24px !important;
            line-height: 100% !important;
            margin: 0 !important;
          }
          .research-related-card-inner p {
            width: 100% !important; /* fill available width */
            font-size: 16px !important;
            line-height: 130% !important;
            margin: 0 !important;
          }
          .research-related-card-inner a {
            width: 100% !important; /* full-width button */
            height: 36px !important;
            border-radius: 100px !important;
            /* Add breathing room below the CTA */
            margin-bottom: 8px !important;
          }
          /* Hide gradient ellipse inside cards on mobile */
          .research-related-card .pointer-events-none {
            display: none !important;
          }
          /* Frame 1000004806 - hero container */
          .research-detail-hero {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding: 0 16px 24px !important;
            width: 100% !important;
            min-height: 358px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            margin-top: 94px !important;
          }
          /* Frame 1000012139 - inner row */
          .research-detail-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            padding: 0 !important;
            gap: 22px !important;
            width: 100% !important;
            height: auto !important;
          }
          /* Frame 25 - text column */
          .research-detail-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 0 !important;
            gap: 24px !important;
            width: 100% !important;
            height: auto !important;
            flex: 1 1 auto !important;
          }
          /* Title */
          .research-detail-title {
            width: 100% !important;
            height: auto !important;
            /* Keep web font style; do not override family/weight */
            /* Adjust size only if needed; otherwise inherit */
            line-height: 120% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
          }
          /* Description */
          .research-detail-desc {
            width: 100% !important;
            height: auto !important;
            /* Keep web font style; do not override family/weight */
            line-height: 130% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
          }
          /* Frame 1000012135 - meta row */
          .research-detail-meta {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            padding: 0 !important;
            gap: 16px !important;
            width: 100% !important;
            height: 24px !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .research-detail-meta .dot {
            width: 6px !important;
            height: 6px !important;
            background: #D9D9D9 !important;
            border-radius: 50% !important;
            flex: 0 0 auto !important;
          }
          .research-detail-date,
          .research-detail-readtime {
            /* Keep web font style; do not override family/weight */
            line-height: 100% !important;
            color: #FFFFFF !important;
            flex: 0 0 auto !important;
            white-space: nowrap !important;
          }
          /* Category chip */
          .research-detail-category {
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 10px !important;
            gap: 10px !important;
            width: 106px !important;
            height: 24px !important;
            background: rgba(5, 176, 179, 0.12) !important;
            border: 1px solid #05B0B3 !important;
            border-radius: 40px !important;
            flex: 0 0 auto !important;
          }
          .research-detail-category span {
            width: auto !important;
            height: 12px !important;
            /* Keep web font style; do not override family/weight */
            line-height: 100% !important;
            color: #05B0B3 !important;
            white-space: nowrap !important;
          }
          /* Frame 47 - CTA column */
          .research-detail-cta {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 0 !important;
            gap: 20px !important;
            width: 100% !important;
            height: auto !important;
          }
          /* Primary CTA (Download) */
          .research-detail-download {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 18px 12px !important;
            gap: 8px !important;
            width: 100% !important;
            height: 50px !important;
            background: #FFFFFF !important;
            border-radius: 100px !important;
            border: none !important;
            color: #0A0A0A !important;
            /* Keep web font style; do not override family/weight/size */
            text-decoration: none !important;
          }
          /* Secondary CTA (Share) */
          .research-detail-share {
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 18px 12px !important;
            gap: 8px !important;
            width: 100% !important;
            height: 50px !important;
            border: 1px solid #FFFFFF !important;
            border-radius: 100px !important;
            background: transparent !important;
            color: #FFFFFF !important;
            /* Keep web font style; do not override family/weight/size */
            text-decoration: none !important;
          }
          /* Reduce right gradient SVG size/impact on mobile */
          .research-detail-bg {
            width: 1100px !important;
            height: 565px !important;
            right: -400px !important;
            top: -120px !important;
          }
          /* Reduce top padding for the main container on mobile only */
          .research-detail-wrapper {
            padding-top: 6px !important; /* was pt-32 (~128px) */
          }
        }
      `}} />
      <Navbar />

      <svg
        width="507"
        height="713"
        viewBox="0 0 507 713"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        className="research-detail-bg"
      >
        <g filter="url(#filter0_f_research_right)">
          <circle
            cx="594.064"
            cy="118.608"
            r="294"
            transform="rotate(-153.197 594.064 118.608)"
            fill="url(#paint0_linear_research_right)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_research_right"
            x="0"
            y="-475.457"
            width="1188.13"
            height="1188.13"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_research_right" />
          </filter>
          <linearGradient
            id="paint0_linear_research_right"
            x1="362.934"
            y1="-145.173"
            x2="920.636"
            y2="32.5919"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3813F3" />
            <stop offset="0.32" stopColor="#05B0B3" />
            <stop offset="0.64" stopColor="#4B25FD" />
            <stop offset="0.8" stopColor="#B9B9E9" />
            <stop offset="1" stopColor="#DE50EC" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10">
        <div className="w-full pt-32 pb-24 px-6 sm:px-10 lg:px-16 xl:px-24 research-detail-wrapper">
          <div className="mx-auto" style={{ maxWidth: '1282px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '22px',
              width: '630px',
            }}
            className="research-detail-hero"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '24px',
                width: '630px',
              }}
              className="research-detail-row research-detail-col"
            >
              <h1
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '48px',
                  lineHeight: '120%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
                className="research-detail-title"
              >
                {report.title}
              </h1>

              <p
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '130%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
                className="research-detail-desc"
              >
                {report.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
                className="research-detail-meta"
              >
                <span
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                  }}
                  className="research-detail-date"
                >
                  Uploaded on {report.date}
                </span>
                <span className="dot"></span>
                <span
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                  }}
                  className="research-detail-readtime"
                >
                  {report.readTime}
                </span>
                <span className="dot"></span>
                <div
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    gap: '10px',
                    background: 'rgba(5, 176, 179, 0.12)',
                    border: '1px solid #05B0B3',
                    borderRadius: '40px',
                  }}
                  className="research-detail-category"
                >
                  <span
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '100%',
                      color: '#05B0B3',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {report.category}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
                className="research-detail-cta"
              >
                <a
                  href={report.pdfUrl ?? '#'}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '18px 12px',
                    gap: '12px',
                    width: '197px',
                    height: '50px',
                    background: '#FFFFFF',
                    borderRadius: '100px',
                    color: '#0A0A0A',
                    fontFamily: 'Gilroy-SemiBold',
                    fontSize: '14px',
                    lineHeight: '100%',
                    textDecoration: 'none',
                    pointerEvents: report.pdfUrl ? 'auto' : 'none',
                    opacity: report.pdfUrl ? 1 : 0.6,
                  }}
                  download
                  className="research-detail-download"
                >
                  <span style={{ display: 'inline-flex', width: '20px', height: '20px' }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4V16"
                        stroke="#1F1F1F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11L12 16L17 11"
                        stroke="#1F1F1F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 20H19"
                        stroke="#1F1F1F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Download PDF
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(report.description)}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '18px 12px',
                    gap: '12px',
                    width: '197px',
                    height: '50px',
                    border: '1px solid #FFFFFF',
                    borderRadius: '100px',
                    background: 'transparent',
                    color: '#FFFFFF',
                    fontFamily: 'Gilroy-SemiBold',
                    fontSize: '14px',
                    lineHeight: '100%',
                    textDecoration: 'none',
                  }}
                  className="research-detail-share"
                >
                  <span style={{ display: 'inline-flex', width: '20px', height: '20px' }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="12" r="2.6" stroke="white" strokeWidth="1.5" fill="none" />
                      <path d="M11.7 10.9L16.6 7.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M11.7 13.1L16.6 16.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="18" cy="6.5" r="2.6" stroke="white" strokeWidth="1.5" fill="none" />
                      <circle cx="18" cy="17.5" r="2.6" stroke="white" strokeWidth="1.5" fill="none" />
                    </svg>
                  </span>
                  Share
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '40px',
              width: '100%',
              maxWidth: '760px',
              marginTop: '140px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '24px',
                  lineHeight: '120%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Key Highlights
              </h2>
              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: 0,
                  margin: 0,
                  listStyle: 'none',
                }}
              >
              {report.summaryPoints.map(point => (
                  <li
                    key={point}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        marginTop: '6px',
                      }}
                    ></span>
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '130%',
                        color: '#FFFFFF',
                      }}
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '48px',
                width: '100%',
              }}
            >
              {report.content.map(section => (
                <div key={section.heading} style={{ maxWidth: '760px' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '120%',
                      color: '#FFFFFF',
                      marginBottom: '16px',
                    }}
                  >
                    {section.heading}
                  </h3>
                  {section.body.map(paragraph => (
                    <p
                      key={paragraph}
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '150%',
                        color: '#FFFFFF',
                        marginBottom: '16px',
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              width: '100%',
              maxWidth: '1282px',
              marginTop: '120px',
            }}
            className="research-related"
          >
            <h2
              style={{
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '36px',
                lineHeight: '130%',
                color: '#FFFFFF',
                margin: 0,
              }}
              className="research-related-title"
            >
              Read More Research Articles
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'nowrap',
                width: '100%',
                justifyContent: 'space-between',
                overflowX: 'auto',
              }}
              className="research-related-list"
            >
              {relatedArticles.map(related => (
                <div
                  key={related.slug}
                  className="relative overflow-hidden research-related-card"
                  style={{
                    position: 'relative',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px',
                    gap: '24px',
                    isolation: 'isolate',
                    width: '414px',
                    height: '311px',
                    background: '#1F1F1F',
                    borderRadius: '16px',
                  }}
                >
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: '588px',
                      height: '588px',
                      left: '399px',
                      top: '-326px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(90deg)',
                      zIndex: 0,
                      borderRadius: '50%',
                    }}
                  ></div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '16px',
                      width: '100%',
                      zIndex: 1,
                    }}
                    className="research-related-card-inner"
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '10px',
                          gap: '10px',
                          background: 'rgba(5, 176, 179, 0.12)',
                          border: '1px solid #05B0B3',
                          borderRadius: '40px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '100%',
                            color: '#05B0B3',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {related.category}
                        </span>
                      </div>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'Gilroy-SemiBold',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '24px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      {related.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'Gilroy-Regular',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '130%',
                        color: '#FFFFFF',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                      }}
                    >
                      {related.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '16px',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-Regular',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                        }}
                      >
                        {related.date}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Gilroy-Regular',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                        }}
                      >
                        {related.readTime}
                      </span>
                    </div>

                    <Link
                      href={`/research/${related.slug}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px 16px',
                        gap: '8px',
                        width: '100%',
                        height: '36px',
                        border: '1px solid #FFFFFF',
                        borderRadius: '100px',
                        background: 'transparent',
                        color: '#FFFFFF',
                        fontFamily: 'Gilroy-SemiBold',
                        fontSize: '14px',
                        lineHeight: '100%',
                        textDecoration: 'none',
                      }}
                    >
                      Read More
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 17L17 7"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 7H17V14"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
}
