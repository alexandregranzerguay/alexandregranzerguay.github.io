import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import styles from './Header.scss';


  
class Header extends Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.toggleClass = this.toggleClass.bind(this);
      this.state = {
        isOpen: false,
        active: false
      };
    }

    active = {
        fontWeight: "bold",
        color: "Red"
    };

    toggleClass() {
        // const currentState = this.state.active;
        this.setState({ active: !this.state.active})
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    render() {
      return (
        <div>
          <Navbar color="light" light expand="lg">
            <NavbarBrand className={styles.title}> Alexandre Granzer-Guay
            {/* <Link to="/"  className={styles.link}>Alexandre Granzer-Guay</Link> */}
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem className={styles.item} onClick={this.toggleClass} active={this.state.active}>
                    <NavLink to="/about" activeStyle={this.active} >About</NavLink>
                </NavItem>
                <NavItem className={styles.item} onClick={this.toggleClass} active={this.state.active}>
                    <NavLink to="/projects" activeStyle={this.active}>Projects</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    }
  }

export default Header;