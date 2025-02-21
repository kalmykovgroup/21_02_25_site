import React from "react";
import styles from './Logo.module.css'

interface LogoProps {
    className?: string
}

const Logo: React.FC<LogoProps> = ({className}: LogoProps) => {
    return (
        <div className={`${className} ${styles.logo}`}>
            Kalmykov Group
        </div>
    )
}

export default Logo;