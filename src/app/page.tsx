import Link from 'next/link';

export default function Home() {
	return (
		<div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<div className="flex flex-col gap-4">
				<Link href="/login">
					<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
						Login
					</button>
				</Link>
				<Link href="/signup">
					<button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
						Signup
					</button>
				</Link>
				<Link href="/PasswordFind">
					<button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Find Password
					</button>
				</Link>
				<Link href="/review/write/2324">
					<button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Review
					</button>
				</Link>
			</div>
		</div>
	);
}
