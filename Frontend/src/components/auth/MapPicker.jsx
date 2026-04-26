"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, LocateFixed, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };
const DEFAULT_ZOOM = 13;

let leafletIconConfigured = false;

const isFiniteCoordinate = (value) =>
  typeof value === "number" && Number.isFinite(value);

const normalizeSelectedPosition = (latitude, longitude) =>
  isFiniteCoordinate(latitude) && isFiniteCoordinate(longitude)
    ? { lat: latitude, lng: longitude }
    : null;

const roundCoordinate = (value) => Number(value.toFixed(6));

const createLeafletMarkerIcon = (leaflet) =>
  leaflet.icon({
    iconRetinaUrl: new URL(
      "leaflet/dist/images/marker-icon-2x.png",
      import.meta.url,
    ).toString(),
    iconUrl: new URL(
      "leaflet/dist/images/marker-icon.png",
      import.meta.url,
    ).toString(),
    shadowUrl: new URL(
      "leaflet/dist/images/marker-shadow.png",
      import.meta.url,
    ).toString(),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const ensureLeafletIcon = (leaflet) => {
  if (leafletIconConfigured) {
    return;
  }

  leaflet.Marker.prototype.options.icon = createLeafletMarkerIcon(leaflet);
  leafletIconConfigured = true;
};

const getGeolocationErrorMessage = (error) => {
  if (!error) {
    return "Unable to detect your current location.";
  }

  if (error.code === 1) {
    return "Location access was denied. You can still choose a point manually on the map.";
  }

  if (error.code === 2) {
    return "Your location could not be determined. Please pick a point manually.";
  }

  if (error.code === 3) {
    return "Location detection timed out. Please choose a point manually.";
  }

  return "Unable to detect your current location.";
};

export default function MapPicker({
  latitude = null,
  longitude = null,
  onChange,
  defaultCenter = CAIRO_CENTER,
  zoom = DEFAULT_ZOOM,
  autoDetectCurrentLocation = true,
  disabled = false,
}) {
  const [isClient, setIsClient] = useState(false);
  const [leafletModule, setLeafletModule] = useState(null);
  const [reactLeafletModule, setReactLeafletModule] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [geolocationError, setGeolocationError] = useState("");
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isLocating, setIsLocating] = useState(autoDetectCurrentLocation);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const geolocationAttemptedRef = useRef(false);

  const selectedPosition = useMemo(
    () => normalizeSelectedPosition(latitude, longitude),
    [latitude, longitude],
  );

  const emitLocationChange = useCallback(
    (nextPosition, shouldCenterMap = true) => {
      const nextLatitude = roundCoordinate(nextPosition.lat);
      const nextLongitude = roundCoordinate(nextPosition.lng);

      onChange?.({
        latitude: nextLatitude,
        longitude: nextLongitude,
      });

      if (shouldCenterMap) {
        setMapCenter({
          lat: nextLatitude,
          lng: nextLongitude,
        });
      }
    },
    [onChange],
  );

  const detectCurrentLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeolocationError(
        "Geolocation is not supported in this browser. Please pick a point manually.",
      );
      setIsLocating(false);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setGeolocationError("");
        emitLocationChange(nextPosition, true);
        setIsLocating(false);
      },
      (error) => {
        setGeolocationError(getGeolocationErrorMessage(error));
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, [emitLocationChange]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    let isMounted = true;

    Promise.all([import("leaflet"), import("react-leaflet")])
      .then(([leafletImport, reactLeafletImport]) => {
        const leaflet = leafletImport.default ?? leafletImport;
        ensureLeafletIcon(leaflet);

        if (!isMounted) {
          return;
        }

        setLeafletModule(leaflet);
        setReactLeafletModule(reactLeafletImport);
        setIsLoadingMap(false);
      })
      .catch((error) => {
        console.error("Failed to load Leaflet modules.", error);
        if (!isMounted) {
          return;
        }

        setLoadError("The map failed to load. Please refresh and try again.");
        setIsLoadingMap(false);
        setIsLocating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isClient]);

  useEffect(() => {
    if (!selectedPosition) {
      return;
    }

    setMapCenter(selectedPosition);
  }, [selectedPosition]);

  useEffect(() => {
    if (
      !autoDetectCurrentLocation ||
      !isClient ||
      geolocationAttemptedRef.current ||
      selectedPosition
    ) {
      if (!autoDetectCurrentLocation) {
        setIsLocating(false);
      }
      return;
    }

    geolocationAttemptedRef.current = true;
    detectCurrentLocation();
  }, [
    autoDetectCurrentLocation,
    detectCurrentLocation,
    isClient,
    selectedPosition,
  ]);

  if (!isClient || isLoadingMap || !leafletModule || !reactLeafletModule) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/80 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <div>
            <p className="font-medium text-slate-900">Loading map...</p>
            <p className="text-sm text-slate-500">
              We are preparing the location picker for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Map unavailable</p>
            <p>{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, Marker, TileLayer, useMap, useMapEvents } =
    reactLeafletModule;

  const MapClickHandler = () => {
    useMapEvents({
      click(event) {
        if (disabled) {
          return;
        }

        emitLocationChange(event.latlng, true);
      },
    });

    return null;
  };

  const MapViewportSync = () => {
    const map = useMap();

    useEffect(() => {
      map.setView([mapCenter.lat, mapCenter.lng], map.getZoom(), {
        animate: true,
      });
    }, [map, mapCenter.lat, mapCenter.lng]);

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Business Location
          </h3>
          <p className="text-sm text-slate-500">
            Click anywhere on the map or drag the marker to set your location.
          </p>
        </div>

        <button
          type="button"
          onClick={detectCurrentLocation}
          disabled={disabled || isLocating}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
          {isLocating ? "Detecting..." : "Use Current Location"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={zoom}
          scrollWheelZoom
          className="h-[320px] w-full sm:h-[380px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewportSync />
          <MapClickHandler />
          {selectedPosition ? (
            <Marker
              draggable={!disabled}
              position={[selectedPosition.lat, selectedPosition.lng]}
              eventHandlers={{
                dragend: (event) => {
                  if (disabled) {
                    return;
                  }

                  emitLocationChange(event.target.getLatLng(), false);
                },
                click: (event) => {
                  if (disabled) {
                    return;
                  }

                  emitLocationChange(event.target.getLatLng(), false);
                },
              }}
            />
          ) : null}
        </MapContainer>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Latitude
          </p>
          <p className="mt-1 font-mono text-sm text-slate-900">
            {selectedPosition ? selectedPosition.lat.toFixed(6) : "Not selected"}
          </p>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Longitude
          </p>
          <p className="mt-1 font-mono text-sm text-slate-900">
            {selectedPosition ? selectedPosition.lng.toFixed(6) : "Not selected"}
          </p>
        </div>
      </div>

      {selectedPosition ? (
        <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Your selected coordinates will be submitted with the vendor request.</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Please pick a location on the map before submitting the form.</p>
        </div>
      )}

      {geolocationError ? (
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p>{geolocationError}</p>
        </div>
      ) : null}
    </div>
  );
}
