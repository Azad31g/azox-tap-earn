function Joystick({ onMove }: { onMove: (d: string) => void }) {
  const btn = (dir: string, label: string) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onMove(dir)
      }}
      style={{
        width: 64,
        height: 64,
        fontSize: 28,
        background: '#166534',
        color: '#4ade80',
        border: '2px solid #4ade80',
        borderRadius: 12,
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '64px 64px 64px',
      gridTemplateRows: '64px 64px 64px',
      gap: 8,
      touchAction: 'none',
    }}>
      <div/>
      {btn('up', '↑')}
      <div/>
      {btn('left', '←')}
      <div style={{ background: '#1a1a1a', borderRadius: '50%' }}/>
      {btn('right', '→')}
      <div/>
      {btn('down', '↓')}
      <div/>
    </div>
  )
}

export default Joystick
