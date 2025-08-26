'use client';

import Link from 'next/link';

import { AppShell } from '@/widgets/layout';

export default function Home() {
	return (
		<AppShell showBottomNav={true}>
			<main className="flex-1">
				<Link href="/review/write/1">
					<button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Review
					</button>
				</Link>
				<Link href="/home">
					<button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Home
					</button>
				</Link>
			</main>
		</AppShell>
	);
}
