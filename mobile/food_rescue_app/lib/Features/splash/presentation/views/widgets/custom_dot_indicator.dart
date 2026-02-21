import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../manager/onboarding_cubit.dart';

class CustomDotIndicator extends StatelessWidget {
  const CustomDotIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    final total = context.read<OnboardingCubit>().listLength;

    return BlocSelector<OnboardingCubit, int, int>(
      selector: (currentIndex) => currentIndex,
      builder: (context, currentIndex) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            total,
            (index) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              height: 8,
              width: currentIndex == index ? 28 : 8,
              decoration: BoxDecoration(
                color: currentIndex == index
                    ? AppColors.primary
                    : Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        );
      },
    );
  }
}
