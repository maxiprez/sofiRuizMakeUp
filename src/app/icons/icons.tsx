type IconProps = { color: string,
  size: number,
  strokeLinecap?: 'round' | 'butt' | 'square' | 'inherit',
  strokeWidth?: number
};

export function HamburgerMenu(props: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24"><path fill={props.color} stroke={props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M4 6h16M4 18h16"/></svg>
    )
}
export function TimesIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24"><path fill={props.color} stroke="currentColor" strokeLinecap={props.strokeLinecap} strokeWidth={props.strokeWidth} d="M6 18L18 6m0 12L6 6"/></svg>
  )
}
export function FluentDoor(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 32 32"><path fill="currentColor" d="M8.25 2A3.25 3.25 0 0 0 5 5.25v21.5A3.25 3.25 0 0 0 8.25 30h9.025a9 9 0 0 1-.9-1H8.25A2.25 2.25 0 0 1 6 26.75V5.25A2.25 2.25 0 0 1 8.25 3h15.5A2.25 2.25 0 0 1 26 5.25v9.602q.513.148 1 .354V5.25A3.25 3.25 0 0 0 23.75 2zM23.5 16a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15M18 23.25c0 .414.336.75.75.75h7.69l-2.72 2.72a.75.75 0 1 0 1.06 1.06l4-4a.75.75 0 0 0 0-1.06l-4-4a.75.75 0 1 0-1.06 1.06l2.72 2.72h-7.69a.75.75 0 0 0-.75.75m-8.5-6a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5"/></svg>
  )
}