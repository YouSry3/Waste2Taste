import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/utils/map_utils.dart';
import '../../../data/models/vendor_distance.dart';
import '../../../data/models/vendor_model.dart';
import 'map_error_widget.dart';
import 'map_loading_spinner.dart';
import 'my_location_button.dart';
import 'vendor_bottom_panel.dart';

class MapViewBody extends StatefulWidget {
  final LatLng? initialLocation;
  final String? targetVendorId;

  const MapViewBody({super.key, this.initialLocation, this.targetVendorId});

  @override
  State<MapViewBody> createState() => _MapViewBodyState();
}

class _MapViewBodyState extends State<MapViewBody> {
  GoogleMapController? _mapController;
  final Location _location = Location();

  LatLng? _currentLocation;

  final Set<Marker> _markers = {};
  final Set<Circle> _circles = {};

  bool _isLoadingLocation = true;
  String? _locationError;

  String? _mapStyle;

  List<VendorDistance> _sortedVendors = [];

  @override
  void initState() {
    super.initState();
    _initLocation();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadMapStyle();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
  }

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _loadMapStyle() async {
    _mapStyle = await DefaultAssetBundle.of(
      context,
    ).loadString('assets/map_style/map_dark.json');
  }

  Future<void> _initLocation() async {
    final success = await _checkServiceAndPermission();
    if (!success) return;

    await _getUserLocation();
  }

  Future<bool> _checkServiceAndPermission() async {
    bool serviceEnabled = await _location.serviceEnabled();

    if (!serviceEnabled) {
      serviceEnabled = await _location.requestService();
      if (!serviceEnabled) {
        _setError("Location service is disabled");
        return false;
      }
    }

    PermissionStatus permission = await _location.hasPermission();

    if (permission == PermissionStatus.denied) {
      permission = await _location.requestPermission();
      if (permission != PermissionStatus.granted) {
        _setError("Location permission denied");
        return false;
      }
    }

    return true;
  }

  Future<void> _getUserLocation() async {
    try {
      final locationData = await _location.getLocation();

      if (!mounted) return;

      final lat = locationData.latitude;
      final lng = locationData.longitude;

      if (lat == null || lng == null) {
        _setError("Could not get location coordinates");
        return;
      }

      final newLocation = LatLng(lat, lng);

      final vendors = _buildSortedVendors(newLocation);
      final markers = _buildMarkers(newLocation);
      final circles = _buildCircle(newLocation);

      setState(() {
        _currentLocation = newLocation;
        _sortedVendors = vendors;

        _markers
          ..clear()
          ..addAll(markers);

        _circles
          ..clear()
          ..addAll(circles);

        _isLoadingLocation = false;
      });
    } catch (e) {
      if (!mounted) return;
      _setError("Error getting location");
    }
  }

  void _setError(String message) {
    if (!mounted) return;

    setState(() {
      _locationError = message;
      _isLoadingLocation = false;
    });
  }

  List<VendorDistance> _buildSortedVendors(LatLng location) {
    final list = List<VendorDistance>.generate(mapVendors.length, (i) {
      final v = mapVendors[i];
      final dist = MapUtils.calculateDistance(
        location,
        LatLng(v.latitude, v.longitude),
      );
      return VendorDistance(v, dist);
    });

    list.sort((a, b) => a.distance.compareTo(b.distance));
    return list;
  }

  Set<Marker> _buildMarkers(LatLng userLocation) {
    final markers = <Marker>{};

    markers.add(
      Marker(
        markerId: const MarkerId("user"),
        position: userLocation,
        infoWindow: const InfoWindow(title: "Your Location"),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
      ),
    );

    if (widget.initialLocation != null && widget.targetVendorId != null) {
      markers.add(
        Marker(
          markerId: MarkerId(widget.targetVendorId!),
          position: widget.initialLocation!,
          infoWindow: const InfoWindow(
            title: "Selected Vendor",
            snippet: "Pickup here",
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        ),
      );
    }

    for (final v in mapVendors) {
      if (widget.targetVendorId != null && v.id == widget.targetVendorId) {
        continue;
      }

      final position = LatLng(v.latitude, v.longitude);

      markers.add(
        Marker(
          markerId: MarkerId(v.id),
          position: position,
          infoWindow: InfoWindow(
            title: v.name,
            snippet: "Tap to get directions",
            onTap: () => MapUtils.openMaps(context, position),
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueGreen,
          ),
        ),
      );
    }

    return markers;
  }

  Set<Circle> _buildCircle(LatLng userLocation) => {
    Circle(
      circleId: const CircleId("search_radius"),
      center: userLocation,
      radius: 5000,
      fillColor: AppColors.primary.withValues(alpha: 0.1),
      strokeColor: AppColors.primary.withValues(alpha: 0.25),
      strokeWidth: 1,
    ),
  };

  void _onVendorTapped(VendorDistance vd) {
    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(
        LatLng(vd.vendor.latitude, vd.vendor.longitude),
        16,
      ),
    );
  }

  void _goToMyLocation() {
    final location = _currentLocation;
    if (location == null) return;

    _mapController?.animateCamera(CameraUpdate.newLatLngZoom(location, 15));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: _buildBody());
  }

  Widget _buildBody() {
    if (_isLoadingLocation) return const MapLoadingSpinner();

    if (_locationError != null) {
      return MapErrorWidget(
        message: _locationError!,
        onRetry: () {
          setState(() {
            _isLoadingLocation = true;
            _locationError = null;
          });
          _initLocation();
        },
      );
    }

    if (_currentLocation == null) {
      return const MapLoadingSpinner();
    }
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Stack(
      children: [
        Column(
          children: [
            Expanded(
              flex: 6,
              child: GoogleMap(
                style: isDark ? _mapStyle : null,
                initialCameraPosition: CameraPosition(
                  target: widget.initialLocation ?? _currentLocation!,
                  zoom: widget.initialLocation != null ? 16 : 15,
                ),
                markers: _markers,
                circles: _circles,
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
                onMapCreated: (controller) {
                  _mapController = controller;
                  if (widget.initialLocation != null) {
                    controller.moveCamera(
                      CameraUpdate.newLatLngZoom(widget.initialLocation!, 16),
                    );
                  }
                },
              ),
            ).animate().fade(duration: 700.ms, curve: Curves.easeIn),

            (_sortedVendors.isNotEmpty &&
                    !_isLoadingLocation &&
                    _locationError == null)
                ? Expanded(
                    flex: 1,
                    child: VendorBottomPanel(
                      vendors: _sortedVendors,
                      onVendorTap: _onVendorTapped,
                    ),
                  ).animate().slideY(
                    begin: 1,
                    end: 0,
                    duration: 500.ms,
                    curve: Curves.easeOutCubic,
                  )
                : const SizedBox(),
          ],
        ),

        Positioned(
          top: 60,
          right: 16,
          child: MyLocationButton(onTap: _goToMyLocation)
              .animate()
              .fade(duration: 400.ms)
              .scale(begin: const Offset(0.8, 0.8)),
        ),
      ],
    );
  }
}
