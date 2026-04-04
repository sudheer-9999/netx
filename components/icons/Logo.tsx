"use client";

import React from "react";

type LogoProps = {
	size?: number;
	className?: string;
	title?: string;
};

export default function Logo({ size = 32, className, title = "Logo" }: LogoProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 48 48"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={title}
			role="img"
			className={className}
		>
			<defs>
				<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#22d3ee" />
					<stop offset="100%" stopColor="#a855f7" />
				</linearGradient>
			</defs>
			<rect x="2" y="2" width="44" height="44" rx="10" fill="url(#g)" />
			<path
				d="M16 31.5L24 14l8 17.5M20.5 26h7"
				fill="none"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

