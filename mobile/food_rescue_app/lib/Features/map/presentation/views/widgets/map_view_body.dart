import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/utils/map_utils.dart';
import '../../../data/models/vendor_distance.dart';
import '../../../data/models/vendor_model.dart';

class MapLoadingSpinner extends StatefulWidget {
  const MapLoadingSpinner({super.key});

  @override
  State<MapLoadingSpinner> createState() => _MapLoadingSpinnerState();
}

class _MapLoadingSpinnerState extends State<MapLoadingSpinner>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pulseAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _pulseAnim = Tween<double>(
      begin: 0.85,
      end: 1.15,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
    _fadeAnim = Tween<double>(
      begin: 0.4,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (_, _) => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ScaleTransition(
              scale: _pulseAnim,
              child: Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary.withValues(alpha: 0.12),
                ),
                child: Center(
                  child: SizedBox(
                    width: 36,
                    height: 36,
                    child: CircularProgressIndicator(
                      color: AppColors.primary,
                      strokeWidth: 3,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            FadeTransition(
              opacity: _fadeAnim,
              child: Text(
                "Finding your location...",
                style: AppTextStyles.body.copyWith(
                  color: Colors.grey.shade600,
                  fontSize: 14,
                  letterSpacing: 0.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MapErrorWidget extends StatefulWidget {
  final String message;
  final VoidCallback onRetry;

  const MapErrorWidget({
    super.key,
    required this.message,
    required this.onRetry,
  });

  @override
  State<MapErrorWidget> createState() => _MapErrorWidgetState();
}

class _MapErrorWidgetState extends State<MapErrorWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _slideAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..forward();

    _slideAnim = Tween<double>(
      begin: 40,
      end: 0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));
    _fadeAnim = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (_, _) => Opacity(
        opacity: _fadeAnim.value,
        child: Transform.translate(
          offset: Offset(0, _slideAnim.value),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.red.shade50,
                    ),
                    child: Icon(
                      Icons.location_off_rounded,
                      size: 40,
                      color: Colors.red.shade400,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    "Location Unavailable",
                    style: AppTextStyles.body.copyWith(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade800,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.message,
                    style: AppTextStyles.body.copyWith(
                      fontSize: 13,
                      color: Colors.grey.shade500,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 28),
                  _RetryButton(onTap: widget.onRetry),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RetryButton extends StatefulWidget {
  final VoidCallback onTap;
  const _RetryButton({required this.onTap});

  @override
  State<_RetryButton> createState() => _RetryButtonState();
}

class _RetryButtonState extends State<_RetryButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
    );
    _scaleAnim = Tween<double>(
      begin: 1.0,
      end: 0.94,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        widget.onTap();
      },
      onTapCancel: () => _controller.reverse(),
      child: ScaleTransition(
        scale: _scaleAnim,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.35),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.refresh_rounded, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              Text(
                AppStrings.retry,
                style: AppTextStyles.button.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────

/// My Location FAB with haptic + scale animation
class MyLocationButton extends StatefulWidget {
  final VoidCallback onTap;
  const MyLocationButton({super.key, required this.onTap});

  @override
  State<MyLocationButton> createState() => _MyLocationButtonState();
}

class _MyLocationButtonState extends State<MyLocationButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );
    _scaleAnim = Tween<double>(
      begin: 1.0,
      end: 0.88,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        HapticFeedback.lightImpact();
        widget.onTap();
      },
      onTapCancel: () => _controller.reverse(),
      child: ScaleTransition(
        scale: _scaleAnim,
        child: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.15),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Icon(
            Icons.my_location_rounded,
            color: AppColors.primary,
            size: 22,
          ),
        ),
      ),
    );
  }
}

class VendorCard extends StatefulWidget {
  final VendorDistance vendorDistance;
  final VoidCallback onTap;
  final int index;

  const VendorCard({
    super.key,
    required this.vendorDistance,
    required this.onTap,
    required this.index,
  });

  @override
  State<VendorCard> createState() => _VendorCardState();
}

class _VendorCardState extends State<VendorCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _entryController;
  late Animation<double> _slideAnim;
  late Animation<double> _fadeAnim;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _entryController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _slideAnim = Tween<double>(begin: 60, end: 0).animate(
      CurvedAnimation(parent: _entryController, curve: Curves.easeOutCubic),
    );
    _fadeAnim = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(parent: _entryController, curve: Curves.easeOut));

    Future.delayed(Duration(milliseconds: 80 * widget.index), () {
      if (mounted) _entryController.forward();
    });
  }

  @override
  void dispose() {
    _entryController.dispose();
    super.dispose();
  }

  String _formatDistance(double km) {
    if (km < 1) return "${(km * 1000).toStringAsFixed(0)} m";
    return "${km.toStringAsFixed(1)} km";
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _entryController,
      builder: (_, _) => Opacity(
        opacity: _fadeAnim.value,
        child: Transform.translate(
          offset: Offset(_slideAnim.value, 0),
          child: GestureDetector(
            onTapDown: (_) => setState(() => _isPressed = true),
            onTapUp: (_) {
              setState(() => _isPressed = false);
              HapticFeedback.selectionClick();
              widget.onTap();
            },
            onTapCancel: () => setState(() => _isPressed = false),
            child: AnimatedScale(
              scale: _isPressed ? 0.96 : 1.0,
              duration: const Duration(milliseconds: 120),
              curve: Curves.easeInOut,
              child: Container(
                width: 200,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(
                        alpha: _isPressed ? 0.05 : 0.09,
                      ),
                      blurRadius: _isPressed ? 5 : 10,
                      offset: Offset(0, _isPressed ? 2 : 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppColors.primary.withValues(alpha: 0.15),
                            AppColors.primary.withValues(alpha: 0.07),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.storefront_rounded,
                        color: AppColors.primary,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            widget.vendorDistance.vendor.name,
                            style: AppTextStyles.subtitle.copyWith(
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                              color: Colors.grey.shade800,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(
                                Icons.near_me_rounded,
                                size: 11,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: 3),
                              Text(
                                _formatDistance(widget.vendorDistance.distance),
                                style: AppTextStyles.label.copyWith(
                                  color: AppColors.primary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.chevron_right_rounded,
                      color: Colors.grey.shade400,
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class VendorBottomPanel extends StatefulWidget {
  final List<VendorDistance> vendors;
  final void Function(VendorDistance) onVendorTap;

  const VendorBottomPanel({
    super.key,
    required this.vendors,
    required this.onVendorTap,
  });

  @override
  State<VendorBottomPanel> createState() => _VendorBottomPanelState();
}

class _VendorBottomPanelState extends State<VendorBottomPanel>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    )..forward();

    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _slideAnim,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 10, bottom: 8),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Icon(
                    Icons.store_mall_directory_rounded,
                    size: 15,
                    color: AppColors.primary,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    "${widget.vendors.length} Nearby Vendors",
                    style: AppTextStyles.subtitle.copyWith(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 80,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                physics: const BouncingScrollPhysics(),
                itemCount: widget.vendors.length,
                itemBuilder: (context, index) => VendorCard(
                  vendorDistance: widget.vendors[index],
                  onTap: () => widget.onVendorTap(widget.vendors[index]),
                  index: index,
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}

class MapViewBody extends StatefulWidget {
  final LatLng? initialLocation;
  final String? targetVendorId;

  const MapViewBody({super.key, this.initialLocation, this.targetVendorId});

  @override
  State<MapViewBody> createState() => _MapViewBodyState();
}

class _MapViewBodyState extends State<MapViewBody>
    with SingleTickerProviderStateMixin {
  GoogleMapController? _mapController;
  final Location _location = Location();

  LatLng? _currentLocation;
  Set<Marker> _markers = {};
  Set<Circle> _circles = {};
  bool _isLoadingLocation = true;
  String? _locationError;
  List<VendorDistance> _sortedVendors = [];

  late AnimationController _mapFadeController;
  late Animation<double> _mapFadeAnim;

  @override
  void initState() {
    super.initState();
    _mapFadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _mapFadeAnim = CurvedAnimation(
      parent: _mapFadeController,
      curve: Curves.easeIn,
    );
    _getUserLocation();
  }

  @override
  void dispose() {
    _mapController?.dispose();
    _mapFadeController.dispose();
    super.dispose();
  }

  Future<void> _getUserLocation() async {
    try {
      bool serviceEnabled = await _location.serviceEnabled();
      if (!serviceEnabled) {
        serviceEnabled = await _location.requestService();
        if (!serviceEnabled) {
          if (!mounted) return;
          setState(() {
            _locationError = "Location service is disabled";
            _isLoadingLocation = false;
          });
          return;
        }
      }

      PermissionStatus permission = await _location.hasPermission();
      if (permission == PermissionStatus.denied) {
        permission = await _location.requestPermission();
        if (permission != PermissionStatus.granted) {
          if (!mounted) return;
          setState(() {
            _locationError = "Location permission denied";
            _isLoadingLocation = false;
          });
          return;
        }
      }

      final locationData = await _location.getLocation();
      if (!mounted) return;

      if (locationData.latitude != null && locationData.longitude != null) {
        final newLocation = LatLng(
          locationData.latitude!,
          locationData.longitude!,
        );

        final vendors = _buildSortedVendors(newLocation);
        final markers = _buildMarkers(newLocation);
        final circles = _buildCircle(newLocation);

        setState(() {
          _currentLocation = newLocation;
          _sortedVendors = vendors;
          _markers = markers;
          _circles = circles;
          _isLoadingLocation = false;
        });
      } else {
        setState(() {
          _locationError = "Could not get location coordinates";
          _isLoadingLocation = false;
        });
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _locationError = "Error getting location: ${e.toString()}";
        _isLoadingLocation = false;
      });
    }
  }

  List<VendorDistance> _buildSortedVendors(LatLng location) {
    return mapVendors.map((v) {
      final dist = MapUtils.calculateDistance(
        location,
        LatLng(v.latitude, v.longitude),
      );
      return VendorDistance(v, dist);
    }).toList()..sort((a, b) => a.distance.compareTo(b.distance));
  }

  Set<Marker> _buildMarkers(LatLng userLocation) {
    final Set<Marker> markers = {
      Marker(
        markerId: const MarkerId("user"),
        position: userLocation,
        infoWindow: const InfoWindow(title: "Your Location"),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
      ),
    };

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

    for (var v in mapVendors) {
      if (widget.targetVendorId != null && v.id == widget.targetVendorId) {
        continue;
      }
      markers.add(
        Marker(
          markerId: MarkerId(v.id),
          position: LatLng(v.latitude, v.longitude),
          infoWindow: InfoWindow(
            title: v.name,
            snippet: "Tap to get directions",
            onTap: () =>
                MapUtils.openMaps(context, LatLng(v.latitude, v.longitude)),
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
    if (_currentLocation != null && _mapController != null) {
      _mapController!.animateCamera(
        CameraUpdate.newLatLngZoom(_currentLocation!, 15),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildBody(),
      bottomSheet:
          (_sortedVendors.isNotEmpty &&
              !_isLoadingLocation &&
              _locationError == null)
          ? VendorBottomPanel(
              vendors: _sortedVendors,
              onVendorTap: _onVendorTapped,
            )
          : null,
    );
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
          _getUserLocation();
        },
      );
    }

    if (_currentLocation == null) return const MapLoadingSpinner();

    return Stack(
      children: [
        FadeTransition(
          opacity: _mapFadeAnim,
          child: GoogleMap(
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
              _mapFadeController.forward();
              if (widget.initialLocation != null) {
                controller.moveCamera(
                  CameraUpdate.newLatLngZoom(widget.initialLocation!, 16),
                );
              }
            },
          ),
        ),

        Positioned(
          top: 60,
          right: 16,
          child: MyLocationButton(onTap: _goToMyLocation),
        ),
      ],
    );
  }
}
