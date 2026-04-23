interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export default function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, style }: IconProps) {
  const paths: Record<string, React.ReactNode> = {
    chat: <><path d="M21 12a8 8 0 1 1-3.4-6.54" /><path d="M21 4v5h-5" /><circle cx="9" cy="12" r="1" fill={color} /><circle cx="13" cy="12" r="1" fill={color} /><circle cx="17" cy="12" r="1" fill={color} /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></>,
    send: <path d="m4 4 16 8-16 8 3-8z" fill={color} />,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>,
    check: <path d="m4 12 5 5L20 6" />,
    x: <><path d="M6 6l12 12M18 6 6 18"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
    chevDown: <path d="m6 9 6 6 6-6"/>,
    chevRight: <path d="m9 6 6 6-6 6"/>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></>,
    share: <><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m9 10.5 6-3"/><path d="m9 13.5 6 3"/></>,
    shield: <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z" />,
    building: <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2"/></>,
    map: <><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/></>,
    phone: <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    external: <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    sparkles: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5 5l2.5 2.5M16.5 16.5 19 19M5 19l2.5-2.5M16.5 7.5 19 5"/>,
    users: <><circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M16 3.5a4 4 0 0 1 0 7.9"/><path d="M22 21c0-3-1.8-5.6-4.5-6.7"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></>,
    bulb: <><path d="M9 21h6"/><path d="M10 18h4"/><path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z"/></>,
    heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".6" fill={color}/></>,
  };
  const p = paths[name];
  if (!p) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {p}
    </svg>
  );
}
