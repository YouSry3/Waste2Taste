import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_state.dart';
import 'package:waste2taste/Features/map/data/models/vendor_mapper.dart';
import 'package:waste2taste/Features/map/data/models/vendor_model.dart';
import 'widgets/map_view_body.dart';

class MapView extends StatelessWidget {
  const MapView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<GetProductsCubit, GetProductsState>(
        builder: (context, state) {
          final List<VendorModel> vendors;
          if (state is GetProductsSuccessState) {
            vendors = VendorMapper.fromProducts(state.data);
          } else {
            vendors = [];
          }
          return MapViewBody(vendors: vendors);
        },
      ),
    );
  }
}
