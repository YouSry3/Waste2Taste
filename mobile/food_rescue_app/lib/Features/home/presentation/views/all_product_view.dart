import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../manager/all_products_filter_cubit/all_products_filter_cubit.dart';
import 'widgets/all_product_view_body.dart';

class AllProductsView extends StatelessWidget {
  const AllProductsView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AllProductsFilterCubit(),
      child: const Scaffold(body: AllProductsViewBody()),
    );
  }
}
