import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/Features/products/presentation/manager/add_review_cubit/add_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/write_review_sheet.dart';

class CustomFloatingActionButtom extends StatelessWidget {
  const CustomFloatingActionButtom({super.key});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: () {
        final extra = GoRouterState.of(context).extra as Map<String, dynamic>;
        final productId = extra['productId'] as String;

        final addReviewCubit = context.read<AddReviewCubit>();

        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          backgroundColor: Colors.transparent,
          builder: (bottomSheetContext) => BlocProvider.value(
            value: addReviewCubit,
            child: WriteReviewSheet(productId: productId),
          ),
        );
      },
      backgroundColor: AppColors.primary,
      icon: const Icon(LucideIcons.penTool, color: Colors.white),
      label: Text(context.loc.writeReview, style: AppTextStyles.button),
    );
  }
}
