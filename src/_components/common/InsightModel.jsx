"use client";

import { openAIServices } from "@/_service";
import { useState, useRef, useMemo, useEffect } from "react";
import { Overlay, Popover, Spinner } from "react-bootstrap";
import { FiZap } from "react-icons/fi";
import ChatBotWidget from "./ChatBotWidget";
import ReactMarkdown from "react-markdown";

export default function InfoPopover({
  title,
  description = "AI insight",
  placement = "left",
  kpi,
  targets,
  payload,
  revealDelay = 600,
}) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [visible, setVisible] = useState(0);
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const badgeRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchInsight = async () => {
    if (loading || insight || (!kpi && !payload)) return;
    setLoading(true);
    try {
      const result = await openAIServices.getAIInsight({
        payload,
        kpi,
        targets,
      });
      if (result.success) setInsight(result.data);
      else setInsight(result.error);
    } finally {
      setLoading(false);
    }
  };

  const bullets = useMemo(() => {
    if (!insight) return [];
    return insight.split(/\n{2,}/).filter(Boolean);
  }, [insight]);

  useEffect(() => {
    if (!show || bullets.length === 0) return;
    setVisible(1);
    if (bullets.length === 1) return;
    const id = setInterval(() => {
      setVisible((c) => (c >= bullets.length ? (clearInterval(id), c) : c + 1));
    }, revealDelay);
    return () => clearInterval(id);
  }, [show, bullets, revealDelay]);

  const enter = () => {
    setShow(true);
    fetchInsight();
  };

  const leave = (e) => {
    const t = e.relatedTarget;
    if (
      t instanceof Node &&
      (badgeRef.current?.contains(t) || popoverRef.current?.contains(t))
    )
      return;
    setShow(false);
  };

  const handleClick = () => {
    setOpen(false);
    setTimeout(() => {
      setSessionId((id) => id + 1);
      setOpen(true);
    }, 10);
  };

  const isDark =
    typeof window !== "undefined"
      ? document?.documentElement?.getAttribute("theme") === "dark"
      : false;

  const bulletStyle = {
    backgroundColor: isDark ? "#004c4c" : "#d6f4f2",
    color: isDark ? "#ffffff" : "#1b1b1b",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    boxShadow: isDark
      ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
      : "inset 0 0 0 1px rgba(0,0,0,0.08)",
    textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.6)" : "none",
    padding: "0.75rem",
    borderLeft: `4px solid ${isDark ? "#5ee8e8" : "#00b3b3"}`,
  };

  const markdownComponents = {
    // Dynamic heading rendering for h1–h6
    ...Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => {
        const level = i + 1;
        return [
          `h${level}`,
          ({ node, ...props }) => (
            <div
              style={{
                color: bulletStyle.color,
                fontWeight: 700 - i * 100, // h1:700 → h6:200
                fontSize: `${1.25 - i * 0.1}rem`, // h1:1.25rem → h6:0.75rem
                marginBottom: "0.5rem",
              }}
              {...props}
            />
          ),
        ];
      })
    ),

    p: ({ node, ...props }) => (
      <p
        style={{
          color: bulletStyle.color,
          fontSize: "0.9rem",
          lineHeight: 1.5,
          marginBottom: "0.5rem",
        }}
        {...props}
      />
    ),

    li: ({ node, ...props }) => (
      <li
        style={{
          color: bulletStyle.color,
          fontSize: "0.9rem",
          marginBottom: "0.3rem",
          paddingLeft: "0.5rem",
        }}
        {...props}
      />
    ),

    strong: ({ node, ...props }) => (
      <strong
        style={{ color: bulletStyle.color, fontWeight: 600 }}
        {...props}
      />
    ),

    em: ({ node, ...props }) => (
      <em
        style={{ color: bulletStyle.color, fontStyle: "italic" }}
        {...props}
      />
    ),

    blockquote: ({ node, ...props }) => (
      <blockquote
        style={{
          color: bulletStyle.color,
          borderLeft: `4px solid ${isDark ? "#5ae6e2" : "#0dcaf0"}`,
          paddingLeft: "1rem",
          margin: "0.75rem 0",
          fontStyle: "italic",
          backgroundColor: isDark ? "#2a2a2a" : "#f1f1f1",
          borderRadius: "0.25rem",
        }}
        {...props}
      />
    ),

    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            style={{
              backgroundColor: isDark ? "#333" : "#eee",
              color: bulletStyle.color,
              padding: "0.15rem 0.4rem",
              borderRadius: "4px",
              fontSize: "0.85rem",
            }}
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <pre
          style={{
            backgroundColor: isDark ? "#1d1f21" : "#f8f9fa",
            color: bulletStyle.color,
            padding: "0.75rem",
            borderRadius: "0.375rem",
            overflowX: "auto",
            fontSize: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          <code {...props}>{children}</code>
        </pre>
      );
    },

    a: ({ node, href, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: isDark ? "#7de9f2" : "#0d6efd",
          textDecoration: "underline",
          fontWeight: 500,
        }}
        {...props}
      />
    ),
  };

  return (
    <>
      <span className="position-absolute top-0 end-0 m-2 info-icon">
        <span
          ref={badgeRef}
          role="button"
          aria-label="AI insight"
          className="fw-bold shadow-sm badge text-white"
          style={{
            cursor: "pointer",
            backgroundColor: isDark ? "#2ad3d3" : "#d1f4f2",
            color: isDark ? "#000" : "#005c5c",
            fontWeight: 600,
            fontSize: "0.65rem",
            borderRadius: "0.5rem",
            padding: "0.4em 0.6em",
          }}
          onMouseEnter={enter}
          onMouseLeave={leave}
          onFocus={enter}
          onBlur={leave}
          onClick={handleClick}
        >
          AI
        </span>

        <Overlay
          target={badgeRef.current}
          show={show}
          placement={placement}
          flip
        >
          {(props) => (
            <Popover
              id="ai-popover"
              ref={popoverRef}
              {...props}
              onMouseEnter={() => setShow(true)}
              onMouseLeave={leave}
            >
              {/* <Popover.Body
                className="fs-12 rounded shadow-sm"
                style={{
                  minWidth: "315px",
                  backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                  color: isDark ? "#ffffff" : "#212529",
                }}
              >
                <div
                  className="d-flex gap-2 align-items-center justify-content-center fw-semibold mb-3"
                  style={{
                    color: isDark ? "#5ee8e8" : "#007777",
                  }}
                >
                  <FiZap size={18} />
                  <span>{title}</span>
                </div>

                {loading ? (
                  <div className="text-center py-2">
                    <Spinner
                      animation="border"
                      variant="secondary"
                      size="sm"
                      className="me-2"
                    />
                    <span className="small">Analyzing...</span>
                  </div>
                ) : bullets.length === 0 ? (
                  <p className="text-center text-muted small mb-0">
                    Insight Unavailable
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        maxHeight: "280px",
                        overflowY: "auto",
                        paddingRight: "6px",
                      }}
                    >
                      {hasMounted &&
                        bullets.slice(0, visible).map((b, i) => (
                          <div
                            key={i}
                            className="mb-3 rounded"
                            style={bulletStyle}
                          >
                            <ReactMarkdown components={markdownComponents}>
                              {b}
                            </ReactMarkdown>
                          </div>
                        ))}
                    </div>

                    {visible === bullets.length && (
                      <div className="text-center text-success small mt-2">
                        ✔ Done analyzing
                      </div>
                    )}
                  </>
                )}
              </Popover.Body> */}
              <Popover.Body
                className="fs-12 rounded shadow-sm"
                style={{
                  minWidth: "300px",
                  backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                  color: isDark ? "#ffffff" : "#212529",
                }}
              >
                <div
                  className="d-flex gap-2 align-items-center justify-content-center fw-semibold mb-3"
                  style={{
                    color: isDark ? "#5ee8e8" : "#007777",
                  }}
                >
                  <FiZap size={18} />
                  <span>{title}</span>
                </div>

                {loading ? (
                  <div className="text-center py-2">
                    <Spinner
                      animation="border"
                      variant="secondary"
                      size="sm"
                      className="me-2"
                    />
                    <span className="small">Analyzing...</span>
                  </div>
                ) : bullets.length === 0 ? (
                  <p className="text-center text-muted small mb-0">
                    Insight Unavailable
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        maxHeight: "280px",
                        overflowY: "auto",
                        paddingRight: "6px",
                      }}
                    >
                      {hasMounted && (
                        <div className="mb-3 rounded" style={bulletStyle}>
                          <ReactMarkdown components={markdownComponents}>
                            {` Insight Unavailable : WIP `}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {visible === bullets.length && (
                      <div className="text-center text-success small mt-2">
                        ✔ Done analyzing
                      </div>
                    )}
                  </>
                )}
              </Popover.Body>
            </Popover>
          )}
        </Overlay>
      </span>

      {open && (
        <ChatBotWidget
          open={open}
          setOpen={setOpen}
          aiInput={{ payload, kpi, targets }}
          contextTitle={title}
        />
      )}
    </>
  );
}

// "use client";

// import { openAIServices } from "@/_service";
// import { useState, useRef, useMemo, useEffect } from "react";
// import { Overlay, Popover, Spinner } from "react-bootstrap";
// import { FiZap } from "react-icons/fi";
// import ReactMarkdown from "react-markdown";
// import { useChatBot } from "@/_context/ChatBotContext";

// export default function InfoPopover({
//   title,
//   placement = "left",
//   kpi,
//   targets,
//   payload,
//   revealDelay = 600,
// }) {
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [insight, setInsight] = useState(null);
//   const [visible, setVisible] = useState(0);

//   const [hasMounted, setHasMounted] = useState(false);

//   const badgeRef = useRef(null);
//   const popoverRef = useRef(null);
//   const { launchChat } = useChatBot();

//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   const fetchInsight = async () => {
//     if (loading || insight || (!kpi && !payload)) return;
//     setLoading(true);
//     try {
//       const result = await openAIServices.getAIInsight({
//         payload,
//         kpi,
//         targets,
//       });
//       if (result.success) setInsight(result.data);
//       else setInsight(result.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bullets = useMemo(() => {
//     if (!insight) return [];
//     return insight.split(/\n{2,}/).filter(Boolean);
//   }, [insight]);

//   useEffect(() => {
//     if (!show || bullets.length === 0) return;
//     setVisible(1);
//     if (bullets.length === 1) return;
//     const id = setInterval(() => {
//       setVisible((c) => (c >= bullets.length ? (clearInterval(id), c) : c + 1));
//     }, revealDelay);
//     return () => clearInterval(id);
//   }, [show, bullets, revealDelay]);

//   const enter = () => {
//     setShow(true);
//     fetchInsight();
//   };

//   const leave = (e) => {
//     const t = e.relatedTarget;
//     if (
//       t instanceof Node &&
//       (badgeRef.current?.contains(t) || popoverRef.current?.contains(t))
//     )
//       return;
//     setShow(false);
//   };

//   const handleClick = () => {
//     launchChat({
//       aiInput: { payload, kpi, targets },
//       contextTitle: title,
//     });
//   };

//   const isDark =
//     typeof window !== "undefined"
//       ? document?.documentElement?.getAttribute("theme") === "dark"
//       : false;

//   const bulletStyle = {
//     backgroundColor: isDark ? "#004c4c" : "#d6f4f2",
//     color: isDark ? "#ffffff" : "#1b1b1b",
//     fontSize: "0.95rem",
//     lineHeight: 1.6,
//     boxShadow: isDark
//       ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
//       : "inset 0 0 0 1px rgba(0,0,0,0.08)",
//     textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.6)" : "none",
//     padding: "0.75rem",
//     borderLeft: `4px solid ${isDark ? "#5ee8e8" : "#00b3b3"}`,
//   };

//   const markdownComponents = {
//     // Dynamic heading rendering for h1–h6
//     ...Object.fromEntries(
//       Array.from({ length: 6 }, (_, i) => {
//         const level = i + 1;
//         return [
//           `h${level}`,
//           ({ node, ...props }) => (
//             <div
//               style={{
//                 color: bulletStyle.color,
//                 fontWeight: 700 - i * 100, // h1:700 → h6:200
//                 fontSize: `${1.25 - i * 0.1}rem`, // h1:1.25rem → h6:0.75rem
//                 marginBottom: "0.5rem",
//               }}
//               {...props}
//             />
//           ),
//         ];
//       })
//     ),

//     p: ({ node, ...props }) => (
//       <p
//         style={{
//           color: bulletStyle.color,
//           fontSize: "0.9rem",
//           lineHeight: 1.5,
//           marginBottom: "0.5rem",
//         }}
//         {...props}
//       />
//     ),

//     li: ({ node, ...props }) => (
//       <li
//         style={{
//           color: bulletStyle.color,
//           fontSize: "0.9rem",
//           marginBottom: "0.3rem",
//           paddingLeft: "0.5rem",
//         }}
//         {...props}
//       />
//     ),

//     strong: ({ node, ...props }) => (
//       <strong
//         style={{ color: bulletStyle.color, fontWeight: 600 }}
//         {...props}
//       />
//     ),

//     em: ({ node, ...props }) => (
//       <em
//         style={{ color: bulletStyle.color, fontStyle: "italic" }}
//         {...props}
//       />
//     ),

//     blockquote: ({ node, ...props }) => (
//       <blockquote
//         style={{
//           color: bulletStyle.color,
//           borderLeft: `4px solid ${isDark ? "#5ae6e2" : "#0dcaf0"}`,
//           paddingLeft: "1rem",
//           margin: "0.75rem 0",
//           fontStyle: "italic",
//           backgroundColor: isDark ? "#2a2a2a" : "#f1f1f1",
//           borderRadius: "0.25rem",
//         }}
//         {...props}
//       />
//     ),

//     code: ({ node, inline, className, children, ...props }) => {
//       if (inline) {
//         return (
//           <code
//             style={{
//               backgroundColor: isDark ? "#333" : "#eee",
//               color: bulletStyle.color,
//               padding: "0.15rem 0.4rem",
//               borderRadius: "4px",
//               fontSize: "0.85rem",
//             }}
//             {...props}
//           >
//             {children}
//           </code>
//         );
//       }

//       return (
//         <pre
//           style={{
//             backgroundColor: isDark ? "#1d1f21" : "#f8f9fa",
//             color: bulletStyle.color,
//             padding: "0.75rem",
//             borderRadius: "0.375rem",
//             overflowX: "auto",
//             fontSize: "0.85rem",
//             marginBottom: "1rem",
//           }}
//         >
//           <code {...props}>{children}</code>
//         </pre>
//       );
//     },

//     a: ({ node, href, ...props }) => (
//       <a
//         href={href}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{
//           color: isDark ? "#7de9f2" : "#0d6efd",
//           textDecoration: "underline",
//           fontWeight: 500,
//         }}
//         {...props}
//       />
//     ),
//   };

//   return (
//     <>
//       <span className="position-absolute top-0 end-0 m-2 info-icon">
//         <span
//           ref={badgeRef}
//           role="button"
//           aria-label="AI insight"
//           className="fw-bold shadow-sm badge text-white"
//           style={{
//             cursor: "pointer",
//             backgroundColor: isDark ? "#2ad3d3" : "#d1f4f2",
//             color: isDark ? "#000" : "#005c5c",
//             fontWeight: 600,
//             fontSize: "0.65rem",
//             borderRadius: "0.5rem",
//             padding: "0.4em 0.6em",
//           }}
//           onMouseEnter={enter}
//           onMouseLeave={leave}
//           onFocus={enter}
//           onBlur={leave}
//           onClick={handleClick}
//         >
//           AI
//         </span>

//         <Overlay
//           target={badgeRef.current}
//           show={show}
//           placement={placement}
//           flip
//         >
//           {(props) => (
//             <Popover
//               id="ai-popover"
//               ref={popoverRef}
//               {...props}
//               onMouseEnter={() => setShow(true)}
//               onMouseLeave={leave}
//             >
//               <Popover.Body
//                 className="fs-12 rounded shadow-sm"
//                 style={{
//                   minWidth: "315px",
//                   backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
//                   color: isDark ? "#ffffff" : "#212529",
//                 }}
//               >
//                 <div
//                   className="d-flex gap-2 align-items-center justify-content-center fw-semibold mb-3"
//                   style={{
//                     color: isDark ? "#5ee8e8" : "#007777",
//                   }}
//                 >
//                   <FiZap size={18} />
//                   <span>{title}</span>
//                 </div>

//                 {loading ? (
//                   <div className="text-center py-2">
//                     <Spinner
//                       animation="border"
//                       variant="secondary"
//                       size="sm"
//                       className="me-2"
//                     />
//                     <span className="small">Analyzing...</span>
//                   </div>
//                 ) : bullets.length === 0 ? (
//                   <p className="text-center text-muted small mb-0">
//                     Insight Unavailable
//                   </p>
//                 ) : (
//                   <>
//                     <div
//                       style={{
//                         maxHeight: "280px",
//                         overflowY: "auto",
//                         paddingRight: "6px",
//                       }}
//                     >
//                       {hasMounted &&
//                         bullets.slice(0, visible).map((b, i) => (
//                           <div
//                             key={i}
//                             className="mb-3 rounded"
//                             style={bulletStyle}
//                           >
//                             <ReactMarkdown components={markdownComponents}>
//                               {b}
//                             </ReactMarkdown>
//                           </div>
//                         ))}
//                     </div>

//                     {visible === bullets.length && (
//                       <div className="text-center text-success small mt-2">
//                         ✔ Done analyzing
//                       </div>
//                     )}
//                   </>
//                 )}
//               </Popover.Body>
//             </Popover>
//           )}
//         </Overlay>
//       </span>
//     </>
//   );
// }
