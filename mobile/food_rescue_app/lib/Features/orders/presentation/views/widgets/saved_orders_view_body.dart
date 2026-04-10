import 'package:flutter/material.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../data/models/order_model.dart';
import 'saved_offer_card.dart';

class SavedOrdersViewBody extends StatelessWidget {
  const SavedOrdersViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text(
            context.loc.savedOffers,
            style: AppTextStyles.appBarTitle,
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 10)),
        SliverToBoxAdapter(child: SavedOfferCard(order: mockActiveOrders[0])),
      ],
    );
  }
}
