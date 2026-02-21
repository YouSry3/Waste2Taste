import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
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
      child: Align(
        alignment: Alignment.centerRight,
        child: Padding(
          padding: const EdgeInsets.only(top: 50, right: 16),
          child: TextButton(
            style: TextButton.styleFrom(foregroundColor: AppColors.textGray),
            onPressed: () => context.read<OnboardingCubit>().jumpToPage(),
            child: const Text('Skip'),
          ),
        ),
      ),
    );
  }
}
