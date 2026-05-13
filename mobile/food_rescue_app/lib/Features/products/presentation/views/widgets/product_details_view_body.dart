import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/image_header_widget_for_product_details.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/product_details_widget.dart';
import '../../../../home/domain/entities/product_entity.dart';
import 'reserve_button_bloc_consumer.dart';

class ProductDetailsViewBody extends StatelessWidget {
  const ProductDetailsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    final product = GoRouterState.of(context).extra as ProductEntity;
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
          child: ReserveButtonBlocConsumer(product: product)),
      ],
    );
  }
}
