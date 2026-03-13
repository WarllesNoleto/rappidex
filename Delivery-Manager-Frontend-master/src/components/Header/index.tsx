import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Hamburger, Scroll, User, SignOut, FilePlus, UserPlus } from 'phosphor-react'

import { HeaderContainer, RappidexLogo } from './styles'
import { DeliveryContext } from '../../context/DeliveryContext'

export function Header() {
  const { logout, permission } = useContext(DeliveryContext)

  function handleLogout(){
    logout()
  }

  return (
    <HeaderContainer>
      <NavLink to="/" title="Entregas">
        <RappidexLogo src="https://i.pinimg.com/736x/a5/9f/17/a59f176343c6fd0d83adea72eaf0c57f.jpg" />
      </NavLink>
      <nav>
        {permission === 'admin' && 
          <NavLink to="/novo-usuario" title="Novo Usuário">
            <UserPlus  size={24} />
          </NavLink>
        }
        {(permission === 'admin' || permission === 'shopkeeper' || permission === 'shopkeeperadmin') && 
          <NavLink to="/nova-entrega" title="Nova entrega">
            <FilePlus  size={24} />
          </NavLink>
        }
        <NavLink to="/" title="Entregas">
          <Hamburger  size={24} />
        </NavLink>
        <NavLink to="/relatorios" title="Relatórios">
          <Scroll size={24} />
        </NavLink>
        <NavLink to="/perfil" title="Perfil">
          <User  size={24} />
        </NavLink>
        <NavLink to="/" onClick={handleLogout} title="Sair">
          <SignOut size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
