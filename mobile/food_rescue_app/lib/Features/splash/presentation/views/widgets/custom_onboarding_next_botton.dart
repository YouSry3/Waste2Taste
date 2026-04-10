import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/utils/app_routes.dart';
import '../../manager/onboarding_cubit.dart';

class CustomOnboardingNextButton extends StatelessWidget {
  const CustomOnboardingNextButton({super.key});

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<OnboardingCubit>();
    return SizedBox(
      width: MediaQuery.sizeOf(context).width * 0.96,
      child: BlocBuilder<OnboardingCubit, int>(
        builder: (context, state) {
          return ElevatedButton(
            onPressed: cubit.isLastPage
                ? () => GoRouter.of(context).pushReplacement(AppRoutes.login)
                : cubit.next,
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.all(16),
              backgroundColor: cubit.currentIndex == cubit.getLastPage
                  ? AppColors.primary
                  : AppColors.secondary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              elevation: 0,
            ),
            child: Text(
              cubit.currentIndex == cubit.getLastPage
                  ? context.loc.getStarted
                  : context.loc.next,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          );
        },
      ),
    );
  }
}
