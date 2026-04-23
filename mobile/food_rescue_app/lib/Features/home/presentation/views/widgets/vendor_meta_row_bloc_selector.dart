import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:waste2taste/core/utils/map_utils.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_user_location_cubit/get_user_location_cubit.dart';
import 'vendor_meta_row.dart';

class VendorMetaRowBlocSelector extends StatelessWidget {
  const VendorMetaRowBlocSelector({super.key, required this.product});

  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return BlocSelector<GetUserLocationCubit, GetUserLocationState, LatLng>(
      selector: (state) {
        if (state is GetUserLocationSuccessState) {
          return LatLng(
            state.locationEntity.latitude,
            state.locationEntity.longitude,
          );
        }
        return const LatLng(0.0, 0.0);
      },
      builder: (context, userLocation) {
        return VendorMetaRow(
          vendorName: product.vendorName,
          distance: MapUtils.formatDistance(
            MapUtils.calculateDistance(
              LatLng(product.latitude, product.longitude),
              userLocation,
            ),
          ),
        );
      },
    );
  }
}
