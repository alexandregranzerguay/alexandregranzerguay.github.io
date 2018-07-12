import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem} from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.scss';


  
class Header extends Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false,
      };
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    render() {
      return (
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand className={styles.title}>
            <Link to="/" className={styles.link}>Alexandre Granzer-Guay</Link>
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem className={styles.item}>
                    <NavLink to="/about" className="nav-link" >About</NavLink>
                </NavItem>
                <NavItem className={styles.item}>
                    <NavLink to="/projects" className="nav-link">Projects</NavLink>
                </NavItem>
                <NavItem className={styles.item}>
                    <NavLink to="/misc" className="nav-link">Misc.</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    }
  }

export default Header;