"use client";

import React, { PropsWithChildren } from "react";
import { motion } from "framer-motion";

type SectionProps = PropsWithChildren<{
	id?: string;
	title?: string;
	subtitle?: string;
	className?: string;
}>;

export default function Section({ id, title, subtitle, className, children }: SectionProps) {
	return (
		<section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={className}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
				{title ? (
					<motion.header
						className="mb-8 md:mb-10"
						initial={{ opacity: 0, y: 8 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						viewport={{ once: true }}
					>
						<h2 id={id ? `${id}-title` : undefined} className="text-2xl md:text-3xl font-semibold text-white">
							{title}
						</h2>
						{subtitle ? <p className="mt-2 text-zinc-400">{subtitle}</p> : null}
					</motion.header>
				) : null}
				{children}
			</div>
		</section>
	);
}

