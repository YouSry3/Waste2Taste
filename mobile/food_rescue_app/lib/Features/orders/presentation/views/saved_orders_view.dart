import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_favorite_products_cubit/get_favorite_products_cubit.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'widgets/saved_orders_view_body.dart';

class SavedOrdersView extends StatelessWidget {
  const SavedOrdersView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          getIt.get<GetFavoriteProductsCubit>()..getFavoriteProducts(),
      child: const Scaffold(body: SavedOrdersViewBody()),
    );
  }
}
