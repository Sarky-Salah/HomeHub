// client/src/pages/MapPicker.jsx

import { useMapEvents, Marker } from "react-leaflet";

function MapPicker({ position, setCoordinates }) {

    useMapEvents({
        click(e) {
            setCoordinates({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });
        }
    });

    return position ? (
        <Marker position={[position.lat, position.lng]} />
    ) : null;
}

export default MapPicker;