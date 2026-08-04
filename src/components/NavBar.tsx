import { Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'

const navStyles = css({
  display: 'flex',
  flexDirection: { base: 'column', md: 'row' },
  alignItems: { base: 'stretch', md: 'center' },
  gap: { base: '2', md: '6' },
  padding: { base: '3', md: '4' },
  borderBottom: '1px solid',
  borderColor: 'gray.6',
  backgroundColor: 'gray.2',
  position: 'sticky',
  top: '0',
  zIndex: '10',
})

const homeLinkStyles = css({
  color: 'gray.12',
  fontWeight: 'bold',
  textDecoration: 'none',
  _hover: { color: 'accent.11' },
})

const navLinksStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: { base: '2', md: '6' },
  marginLeft: { md: 'auto' },
  overflowX: 'auto',
})

const linkStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '8',
  color: 'gray.11',
  textDecoration: 'none',
  fontSize: 'sm',
  whiteSpace: 'nowrap',
  _hover: { color: 'accent.11' },
  '&[data-status="active"]': {
    color: 'accent.11',
    fontWeight: 'bold',
  },
})

const navItems = [
  { to: '/career', label: '職務経歴' },
  { to: '/behavior', label: 'スタンス' },
  { to: '/manual', label: 'ワークスタイル' },
] as const

export function NavBar() {
  return (
    <nav className={navStyles}>
      <Link to="/" className={homeLinkStyles}>
        towase.github.io
      </Link>
      <div className={navLinksStyles}>
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className={linkStyles}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
