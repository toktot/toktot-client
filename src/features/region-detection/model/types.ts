type Tm128Polygon = {
	type: 'Polygon';
	coordinates: [number, number][][];
};

type Tm128MultiPolygon = {
	type: 'MultiPolygon';
	coordinates: [number, number][][][];
};

type Tm128Geometry = Tm128Polygon | Tm128MultiPolygon;

export type Tm128GeoJSON = {
	type: 'GeometryCollection';
	geometries: Tm128Geometry[];
};
