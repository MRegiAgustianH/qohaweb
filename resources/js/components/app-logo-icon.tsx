import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Circle */}
            <circle cx="50" cy="50" r="48" fill="#3B653D" />
            {/* Inner Border */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
            
            {/* Top Stars */}
            <g fill="#FFFFFF">
                <polygon transform="translate(-25, 22) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(-13, 14) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(0, 10) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(13, 14) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(25, 22) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
            </g>

            {/* Middle White Banner */}
            <rect x="4" y="38" width="92" height="26" fill="#FFFFFF" />
            
            {/* Main Text */}
            <text x="50" y="55" fill="#3B653D" fontSize="20" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">QOHA</text>
            <text x="50" y="62" fill="#3B653D" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">QORI DAN HAFIZH</text>

            {/* Bottom Stars */}
            <g fill="#FFFFFF" transform="translate(0, 42)">
                <polygon transform="translate(-19, 0) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(-6, 0) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(7, 0) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
                <polygon transform="translate(20, 0) scale(0.6)" points="50,15 54,27 67,27 57,35 60,47 50,40 40,47 43,35 33,27 46,27" />
            </g>
        </svg>
    );
}
