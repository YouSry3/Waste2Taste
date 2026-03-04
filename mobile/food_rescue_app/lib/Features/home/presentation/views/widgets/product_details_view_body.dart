import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../data/models/product_model.dart';
import 'image_header_widget_for_product_details.dart';
import 'product_details_widget.dart';

class ProductDetailsViewBody extends StatelessWidget {
  const ProductDetailsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    final product = GoRouterState.of(context).extra as ProductModel;
    return Stack(
      children: [
        CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: SizedBox(
                height: 300,
                child: ImageHeaderWidgetForProductDetails(product: product),
              ),
            ),
            SliverToBoxAdapter(child: ProductDetailsWidget(product: product)),
          ],
        ),
        Positioned(
          bottom: 16,
          left: 16,
          right: 16,
          child: CustomElevatedButton(
            bgColor: AppColors.secondary,
            onPressed: () {},
            text: AppStrings.reserveNow,
          ),
        ),
      ],
    );
  }
}
