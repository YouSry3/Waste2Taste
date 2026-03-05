import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/app_routes.dart';

class ProfileMenuItemModel {
  final IconData icon;
  final String label;
  final Color color;
  final Function(BuildContext context) onTap;

  ProfileMenuItemModel({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });
}

final List<ProfileMenuItemModel> myActivity = [
  ProfileMenuItemModel(
    icon: LucideIcons.shoppingBag,
    label: AppStrings.myOrders,
    color: Colors.blue,
    onTap: (context) => GoRouter.of(context).push(AppRoutes.ordersView),
  ),
  ProfileMenuItemModel(
    icon: LucideIcons.heart,
    label: AppStrings.savedOffers,
    color: Colors.red,
    onTap: (context) => GoRouter.of(context).push(AppRoutes.savedOrdersView),
  ),
];
final List<ProfileMenuItemModel> generalSettings = [
  ProfileMenuItemModel(
    icon: LucideIcons.user,
    label: AppStrings.editProfile,
    color: AppColors.primary,
    onTap: (context) => GoRouter.of(context).push(AppRoutes.editProfileView),
  ),
  ProfileMenuItemModel(
    icon: LucideIcons.settings,
    label: AppStrings.generalSettings,
    color: Colors.grey,
    onTap: (context) =>
        GoRouter.of(context).push(AppRoutes.generalSettingsView),
  ),
  ProfileMenuItemModel(
    icon: LucideIcons.helpCircle,
    label: AppStrings.helpSupport,
    color: Colors.orange,
    onTap: (context) => GoRouter.of(context).push(AppRoutes.helpAndSupportView),
  ),
];

final List<ProfileMenuItemModel> accountAuth = [
  ProfileMenuItemModel(
    icon: LucideIcons.logOut,
    label: AppStrings.logOut,
    color: Colors.red,
    onTap: (context) {},
  ),
];
