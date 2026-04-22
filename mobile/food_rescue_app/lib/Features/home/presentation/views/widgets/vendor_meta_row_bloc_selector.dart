import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../../../core/utils/map_utils.dart';
import '../../../domain/entities/product_entity.dart';
import '../../manager/get_user_location_cubit/get_user_location_cubit.dart';
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
        return LatLng(0.0, 0.0);
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
