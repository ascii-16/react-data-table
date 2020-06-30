import React, { useState } from 'react';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const Nav = (props) => {
  const [theme, setTheme] = useState('light');

  const switchTheme = () => {
    let mode = (theme === 'dark') ? 'light' : 'dark';

    setTheme(mode);
    props.onThemeChange(mode);
  }

  return (
    <nav className="navbar navbar-dark bg-dark">
      <span className="navbar-brand mb-0 h1"><b>Datatable using React</b></span>
      <span 
        title="Switch theme"
        className={ theme === "dark" ? "theme-switcher dark" : "theme-switcher light" } 
        onClick={switchTheme}>
        { theme === "dark" ? <Brightness7Icon/> : <Brightness4Icon/>}
      </span>
    </nav>
  )
}

export default Nav;