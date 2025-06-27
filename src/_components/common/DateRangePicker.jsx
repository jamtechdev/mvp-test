// "use client";

// import { useRef, useState, useEffect } from "react";
// import { format } from "date-fns";
// import { DateRange } from "react-date-range";
// import { Overlay, Popover, Button } from "react-bootstrap";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// export default function DateRangeDropdown({ value, onChange }) {
//   const target = useRef(null);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [draft, setDraft] = useState({
//     startDate: value.start,
//     endDate: value.end,
//   });

//   /* keep internal draft in sync if parent updates externally */
//   useEffect(() => {
//     setDraft({ startDate: value.start, endDate: value.end });
//   }, [value.start, value.end]);

//   const handleSelect = ({ selection }) => {
//     setDraft(selection);          // update live draft
//   };

//   const applyRange = () => {
//     onChange({ start: draft.startDate, end: draft.endDate });
//     setShowCalendar(false);
//   };

//   return (
//     <>
//       {/* read-only display field */}
//       <input
//         ref={target}
//         type="text"
//         className="form-control bg-white cursor-pointer"
//         readOnly
//         value={`${format(value.start, "yyyy-MM-dd")} – ${format(
//           value.end,
//           "yyyy-MM-dd"
//         )}`}
//         onClick={() => setShowCalendar(true)}
//       />

//       {/* calendar popover */}
//       <Overlay
//         target={target.current}
//         show={showCalendar}
//         placement="bottom-start"
//         rootClose
//         onHide={() => setShowCalendar(false)}
//       >
//         <Popover className="p-3 shadow border-0">
//           <DateRange
//             ranges={[{ ...draft, key: "selection" }]}
//             onChange={handleSelect}
//             moveRangeOnFirstSelection={false}
//             editableDateInputs
//             rangeColors={["#4e79ff"]}
//           />

//           {/* footer with Apply button */}
//           <div className="d-flex justify-content-end pt-2">
//             <Button size="sm" onClick={applyRange}>
//               Apply
//             </Button>
//           </div>
//         </Popover>
//       </Overlay>
//     </>
//   );
// }


"use client";

import { useRef, useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeInput({ value, onChange }) {
  const [open, setOpen]   = useState(false);
  const [draft, setDraft] = useState({
    startDate: value.start,
    endDate:   value.end,
  });

  const wrapperRef = useRef(null);

  /* keep internal draft in sync if parent changes externally */
  useEffect(() => {
    setDraft({ startDate: value.start, endDate: value.end });
  }, [value.start, value.end]);

  /* click-outside handler */
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* update draft live, close when second date chosen */
  const handleSelect = ({ selection }) => {
    const firstPick  = isSameDay(selection.startDate, selection.endDate);
    setDraft(selection);
    onChange({ start: selection.startDate, end: selection.endDate });
    if (!firstPick) setOpen(false);      // close after full range picked
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* read-only display field */}
      <input
        type="text"
        className="form-control cursor-pointer"
        readOnly
        value={`${format(value.start, "yyyy-MM-dd")} – ${format(
          value.end,
          "yyyy-MM-dd"
        )}`}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #dee2e6",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            marginTop: 4,
          }}
        >
          <DateRange
            ranges={[{ ...draft, key: "selection" }]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            editableDateInputs
            rangeColors={["#4e79ff"]}
          />
        </div>
      )}
    </div>
  );
}
