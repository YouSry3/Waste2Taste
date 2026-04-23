import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_state.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'custom_search_widget.dart';
import 'package:waste2taste/core/widgets/custom_sliver_app_bar.dart';
import 'products_sliver_list_builder.dart';

class AllProductsViewBody extends StatefulWidget {
  const AllProductsViewBody({super.key});

  @override
  State<AllProductsViewBody> createState() => _AllProductsViewBodyState();
}

class _AllProductsViewBodyState extends State<AllProductsViewBody> {
  bool _anyDataChanged = false;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        context.pop(_anyDataChanged);
      },
      child: BlocBuilder<GetProductsCubit, GetProductsState>(
        builder: (context, state) {
          final List<ProductEntity> products =
              state is GetProductsSuccessState ? state.data : <ProductEntity>[];
          return CustomScrollView(
            slivers: [
              CustomSliverAppBar(
                onBackPressed: () => context.pop(_anyDataChanged),
                widget: Text(
                  context.loc.allProducts,
                  style: AppTextStyles.title(context),
                ),
              ),
              const HomeSearchBar(),
              ProductsSliverListBuilder(
                products: products,
                onChanged: () {
                  _anyDataChanged = true;
                },
              ),
            ],
          );
        },
      ),
    );
  }
}
