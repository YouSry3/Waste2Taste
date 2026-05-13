import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'order_actions_buttons.dart';
import 'order_info_card_for_confirmation.dart';
import 'status_message.dart';
import 'success_badge.dart';
import 'package:intl/intl.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/orders/data/models/reserve_order_response_model.dart';

class OrderConfirmationViewBody extends StatelessWidget {
  const OrderConfirmationViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    final extra = GoRouterState.of(context).extra as Map<String, dynamic>;
    final response = extra['response'] as ReserveOrderResponseModel;
    final product = extra['product'] as ProductEntity;
    return Stack(
      children: [
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Center(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const SuccessBadge(),
                    const SizedBox(height: 24),
                    const StatusMessage(),
                    const SizedBox(height: 32),
                    OrderInfoCardForConfirmation(
                      icon: LucideIcons.store,
                      title: 'Vendor',
                      subtitle: product.vendorName,
                      iconColor: AppColors.primary,
                      delayMs: 400,
                      onTap: () {},
                    ),
                    const SizedBox(height: 12),
                    OrderInfoCardForConfirmation(
                      icon: LucideIcons.mapPin,
                      title: context.loc.pickupLocation,
                      subtitle: product
                          .vendorName, // Assuming vendor name is the location for now
                      iconColor: AppColors.primary,
                      delayMs: 500,
                      onTap: () {},
                    ),
                    const SizedBox(height: 12),
                    OrderInfoCardForConfirmation(
                      icon: LucideIcons.clock,
                      title: context.loc.pickupTime,
                      subtitle: _formatPickupTime(response.pickupTime),
                      iconColor: AppColors.secondary,
                      delayMs: 600,
                    ),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ),
        ),
        const Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: OrderActionButtons(),
        ),
      ],
    );
  }

  String _formatPickupTime(String timeIso) {
    try {
      final dateTime = DateTime.parse(timeIso).toLocal();
      return DateFormat('MMM d, h:mm a').format(dateTime);
    } catch (e) {
      return timeIso;
    }
  }
}
