import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'order_actions_buttons.dart';
import 'order_info_card_for_confirmation.dart';
import 'status_message.dart';
import 'success_badge.dart';

class OrderConfirmationViewBody extends StatelessWidget {
  const OrderConfirmationViewBody({super.key});

  @override
  Widget build(BuildContext context) {
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
                      icon: LucideIcons.mapPin,
                      title: context.loc.pickupLocation,
                      subtitle: context.loc.pickupLocationValue,
                      iconColor: AppColors.primary,
                      delayMs: 500,
                      onTap: () {},
                    ),
                    const SizedBox(height: 12),
                    OrderInfoCardForConfirmation(
                      icon: LucideIcons.clock,
                      title: context.loc.pickupTime,
                      subtitle: context.loc.pickupTimeValue,
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
}
