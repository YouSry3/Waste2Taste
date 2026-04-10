import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/core/utils/app_routes.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../home/data/models/product_model.dart';
import '../../../../home/presentation/views/widgets/image_header_widget_for_product_details.dart';
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
            onPressed: () =>
                GoRouter.of(context).push(AppRoutes.orderConfirmationView),
            text: context.loc.reserveNow,
          ),
        ),
      ],
    );
  }
}
