import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/enums/order_status.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/l10n/app_localizations.dart';
import 'package:waste2taste/core/mappers/order_status_mapper.dart';

void main() {
  testWidgets('OrderStatusMapper should return correct configurations', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Builder(
          builder: (context) {
            // Test pending status
            final pendingConfig = OrderStatusMapper.getOrderStatusConfig(
              context,
              OrderStatus.pending,
            );
            expect(pendingConfig.color, const Color(0xFFFFA940));
            expect(pendingConfig.icon, LucideIcons.clock);
            expect(pendingConfig.text, context.loc.statusPending);

            // Test ready for pickup status
            final readyConfig = OrderStatusMapper.getOrderStatusConfig(
              context,
              OrderStatus.readyForPickup,
            );
            expect(readyConfig.color, const Color(0xFF2ECC71));
            expect(readyConfig.icon, LucideIcons.packageCheck);
            expect(readyConfig.text, context.loc.statusReady);

            // Test completed status
            final completedConfig = OrderStatusMapper.getOrderStatusConfig(
              context,
              OrderStatus.completed,
            );
            expect(completedConfig.color, Colors.grey);
            expect(completedConfig.icon, LucideIcons.checkCircle);
            expect(completedConfig.text, context.loc.statusCompleted);

            return const SizedBox();
          },
        ),
      ),
    );
  });
}
