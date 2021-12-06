import * as React from "react";

function SvgCo2E(props) {
  return (
    <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#f1b31c" d="M69.627 34.34H47.915v28.951h21.712z" />
      <path fill="#fcea2b" d="M19.287 34.34H3.65v28.951h44.265V34.34z" />
      <g transform="matrix(2.7284 0 0 2.7284 -60.181 -98.128)">
        <rect
          x={23.395}
          y={48.552}
          width={24.182}
          height={10.611}
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={0.906}
          ry={0.118}
        />
        <text
          style={{
            lineHeight: 1.25,
            InkscapeFontSpecification: "Ubuntu",
          }}
          x={22.572}
          y={48.242}
          fontSize={10.853}
          fontFamily="Ubuntu"
          strokeWidth={0.543}
        >
          <tspan x={22.572} y={48.242} fontWeight={700}>
            {"CO\u2082e"}
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default SvgCo2E;

