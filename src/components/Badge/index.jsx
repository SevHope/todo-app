import React from 'react';
import classNames from 'classnames';
import './Badge.css';

const Badge = ({ color, onClick, className }) => 
<i 
onClick={onClick} 
className={classNames('badge', {[`badge--${color}`]: color}, 
className)}>
</i>

export default Badge;