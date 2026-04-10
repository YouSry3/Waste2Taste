import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../manager/onboarding_cubit.dart';

class SkipTextButton extends StatelessWidget {
  const SkipTextButton({super.key});

  @override
  Widget build(BuildContext context) {
    final isLastPage = context.select(
      (OnboardingCubit cubit) => cubit.isLastPage,
    );
    return Visibility(
      maintainAnimation: true,
      maintainState: true,
      maintainSize: true,
      visible: !isLastPage,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 50, right: 16),
            child: TextButton(
              style: TextButton.styleFrom(foregroundColor: AppColors.textGray),
              onPressed: () => context.read<OnboardingCubit>().jumpToPage(),
              child: Text(context.loc.skip),
            ),
          ),
        ],
      ),
    );
  }
}
