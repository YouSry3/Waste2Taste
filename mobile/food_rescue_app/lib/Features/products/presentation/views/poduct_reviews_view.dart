import 'package:flutter/material.dart';
import 'widgets/custom_floating_action_button.dart';
import 'widgets/product_review_view_body.dart';
import 'widgets/reviews_app_bar.dart';

class ProductReviewsView extends StatelessWidget {
  const ProductReviewsView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: ReviewsAppBar(),
      body: ProductReviewsViewBody(),
      floatingActionButton: CustomFloatingActionButtom(),
    );
  }
}
