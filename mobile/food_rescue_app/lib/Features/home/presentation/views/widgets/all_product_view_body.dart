import 'package:flutter/material.dart';
import '../../../data/models/product_model.dart';
import '/core/constants/app_text_styles.dart';
import 'custom_search_widget.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import 'products_sliver_list_builder.dart';

class AllProductsViewBody extends StatelessWidget {
  const AllProductsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    final products = mockProducts.map((e) => ProductModel.fromJson(e)).toList();
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text("All Products", style: AppTextStyles.appBarTitle),
        ),
        const HomeSearchBar(),
        ProductsSliverListBuilder(products: products),
      ],
    );
  }
}
