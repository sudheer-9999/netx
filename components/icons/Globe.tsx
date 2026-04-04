"use client";

import React from "react";

type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};

export default function Globe({ size = 24, className, title = "Globe" }: IconProps) {
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
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
			<path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
			<path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.8" />
		</svg>
	);
}

