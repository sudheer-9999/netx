"use client";

import React from "react";

type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

export default function Window({ size = 24, className, title = "Window" }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label={title}
			role="img"
			className={className}
		>
			<rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
			<path d="M3 8h18" stroke="currentColor" strokeWidth="1.8" />
			<circle cx="6.25" cy="6.5" r="0.9" fill="currentColor" />
			<circle cx="9.25" cy="6.5" r="0.9" fill="currentColor" />
			<circle cx="12.25" cy="6.5" r="0.9" fill="currentColor" />
		</svg>
	);
}

