import React from 'react';
import { NavigationContainer } from './Containers';

interface NavProps {
    icon: string,
    text: string,
    href: string,
    action?: Function
}

function NavItem(props: NavProps) {
    return (
        <a href={props.href}>
            <img src={props.icon} alt="" />
            <span>{props.text}</span>
        </a>
    );
}

// TODO: Make modal singleton using ReactContext

function Navigation() {
    return (
        <NavigationContainer>
            <span>Config Ace</span>
        </NavigationContainer>

    );
}

export default Navigation;
