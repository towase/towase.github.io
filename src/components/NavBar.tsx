import { Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'

const navStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6',
  padding: '4',
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
  marginRight: 'auto',
  _hover: { color: 'accent.11' },
})

const linkStyles = css({
  color: 'gray.11',
  textDecoration: 'none',
  fontSize: 'sm',
  _hover: { color: 'accent.11' },
  '&[data-status="active"]': {
    color: 'accent.11',
    fontWeight: 'bold',
  },
})

const navItems = [
  { to: '/about', label: '自己紹介' },
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
      {navItems.map((item) => (
        <Link key={item.to} to={item.to} className={linkStyles}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
