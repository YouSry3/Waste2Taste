import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../manager/onboarding_cubit.dart';
import 'onboarding_page.dart';

class PageViewOnboardingBuilder extends StatelessWidget {
  const PageViewOnboardingBuilder({super.key});

  @override
  Widget build(BuildContext context) {
    var cubit = BlocProvider.of<OnboardingCubit>(context);
    return PageView.builder(
      controller: cubit.pageController,
      itemCount: cubit.listLength,
      onPageChanged: cubit.onPageChanged,
      itemBuilder: (context, index) {
        return OnboardingPage(model: cubit.getList[index]);
      },
    );
  }
}
