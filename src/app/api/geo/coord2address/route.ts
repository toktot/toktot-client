import { getAddressFromLatLng } from '@/entities/location/lib/geo';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const lat = Number(searchParams.get('lat'));
	const lng = Number(searchParams.get('lng'));

	if (isNaN(lat) || isNaN(lng)) {
		return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
	}

	const address = await getAddressFromLatLng(lat, lng);
	return NextResponse.json({ address });
}
